import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { addYearsClamped, parseDateOnly, todayDateOnly } from '@/lib/format'
import { ApiError, type EmployeeInput, type EmployeeOptions } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Mirrors the backend's rules so users get immediate feedback. The API re-checks
 * everything — this is for responsiveness, not enforcement.
 *
 * Built from the rules the API serves (`/employee-options`) rather than from constants
 * copied into this file, so changing the minimum age or a length cap on the server can't
 * leave the form quietly enforcing the old one.
 */
function buildSchema(rules: EmployeeOptions) {
  const { minimumAgeYears: minAge, countryCodePattern, maxLengths } = rules

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters.')
        .max(maxLengths.name, `Name must be at most ${maxLengths.name} characters.`),
      email: z
        .string()
        .trim()
        .email('Enter a valid email address.')
        .max(maxLengths.email, `Email must be at most ${maxLengths.email} characters.`),
      nationalId: z
        .string()
        .trim()
        .min(3, 'National ID must be at least 3 characters.')
        .max(maxLengths.nationalId, `National ID must be at most ${maxLengths.nationalId} characters.`),
      countryCode: z
        .string()
        .trim()
        .regex(new RegExp(countryCodePattern), "Use a '+' followed by 1-4 digits."),
      phone: z
        .string()
        .trim()
        .min(5, 'Phone number must be at least 5 characters.')
        .max(maxLengths.phone, `Phone number must be at most ${maxLengths.phone} characters.`),
      country: z
        .string()
        .trim()
        .min(2, 'Country must be at least 2 characters.')
        .max(maxLengths.country, `Country must be at most ${maxLengths.country} characters.`),
      gender: z.string().min(1, 'Select a gender.'),
      officialTitle: z.string().min(1, 'Select a job title.'),
      dateOfBirth: z.string().min(1, 'Date of birth is required.'),
      hireDate: z.string().min(1, 'Hire date is required.'),
    })
    .superRefine((values, ctx) => {
      const birth = parseDateOnly(values.dateOfBirth)
      const hire = parseDateOnly(values.hireDate)
      const today = todayDateOnly()
      if (!birth || !hire) return

      const eighteenthBirthday = addYearsClamped(birth, minAge)

      if (birth >= today) {
        ctx.addIssue({
          code: 'custom',
          path: ['dateOfBirth'],
          message: 'Date of birth must be in the past.',
        })
      } else if (eighteenthBirthday > today) {
        ctx.addIssue({
          code: 'custom',
          path: ['dateOfBirth'],
          message: `Employee must be at least ${minAge} years old.`,
        })
      }

      if (hire > today) {
        ctx.addIssue({
          code: 'custom',
          path: ['hireDate'],
          message: 'Hire date cannot be in the future.',
        })
      }

      if (hire < eighteenthBirthday) {
        ctx.addIssue({
          code: 'custom',
          path: ['hireDate'],
          message: `Hire date cannot be before the employee turned ${minAge}.`,
        })
      }
    })
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>

const EMPTY: FormValues = {
  name: '',
  email: '',
  nationalId: '',
  countryCode: '',
  phone: '',
  country: '',
  gender: '',
  officialTitle: '',
  dateOfBirth: '',
  hireDate: '',
}

export function EmployeeForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = id !== undefined

  // The form can't be filled in without the server's rules and dropdown values, so it stays
  // in a loading/error state until they arrive rather than rendering empty selects that can
  // never satisfy the schema.
  const [options, setOptions] = useState<EmployeeOptions | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const schema = useMemo(() => (options ? buildSchema(options) : null), [options])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: EMPTY,
  })

  const load = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const [fetchedOptions, employee] = await Promise.all([
        api.getOptions(),
        isEdit ? api.getEmployee(Number(id)) : Promise.resolve(null),
      ])
      setOptions(fetchedOptions)
      if (employee) {
        const { id: _id, ...values } = employee
        reset(values)
      }
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Failed to load the form.')
    } finally {
      setIsLoading(false)
    }
  }, [id, isEdit, reset])

  useEffect(() => {
    void load()
  }, [load])

  async function onSubmit(values: FormValues) {
    const payload: EmployeeInput = values
    try {
      if (isEdit) {
        await api.updateEmployee(Number(id), payload)
        toast.success('Employee updated.')
      } else {
        await api.createEmployee(payload)
        toast.success('Employee created.')
      }
      navigate('/employees')
    } catch (error) {
      if (error instanceof ApiError) {
        // Surface API validation failures on the fields they belong to; the
        // backend keys them by PascalCase property name.
        const entries = Object.entries(error.fieldErrors)
        const unmapped: string[] = []
        for (const [key, messages] of entries) {
          const field = (key.charAt(0).toLowerCase() + key.slice(1)) as keyof FormValues
          if (field in EMPTY) {
            setError(field, { message: messages.join(' ') })
          } else {
            // Keys like "$.dateOfBirth" come from JSON deserialization failures and match
            // no form field. Without this they'd vanish, leaving a "fix the highlighted
            // fields" toast with nothing highlighted.
            unmapped.push(messages.join(' '))
          }
        }

        if (unmapped.length > 0) {
          toast.error(unmapped.join(' '))
        } else if (entries.length > 0) {
          toast.error('Please fix the highlighted fields.')
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  if (isLoading) {
    return <p className="py-20 text-center text-muted-foreground">Loading…</p>
  }

  if (loadError || !options) {
    return (
      <div className="py-20 text-center">
        <p className="text-destructive">{loadError ?? 'Failed to load the form.'}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" onClick={() => void load()}>
            Try again
          </Button>
          <Button variant="ghost" onClick={() => navigate('/employees')}>
            Back to directory
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[680px] py-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      <p className="mt-1 text-muted-foreground">
        Session 1: Workshop Foundation -{' '}
        {isEdit ? 'Update the details below.' : 'Enter the details of the new hire below.'}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 rounded-xl border bg-card p-8 shadow-sm"
        noValidate
      >
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Full Name" error={errors.name?.message}>
            <Input placeholder="e.g. John Doe" aria-invalid={!!errors.name} {...register('name')} />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="john.doe@company.com"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
          </Field>

          <Field label="National ID" error={errors.nationalId?.message}>
            <Input
              placeholder="ID Number"
              aria-invalid={!!errors.nationalId}
              {...register('nationalId')}
            />
          </Field>

          <Field label="Hire Date" error={errors.hireDate?.message}>
            <Input type="date" aria-invalid={!!errors.hireDate} {...register('hireDate')} />
          </Field>

          <Field label="Job Title" error={errors.officialTitle?.message}>
            <Select
              value={watch('officialTitle')}
              onValueChange={(value) =>
                setValue('officialTitle', value ?? '', { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.officialTitle}>
                <SelectValue placeholder="Select Title" />
              </SelectTrigger>
              <SelectContent>
                {options.titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Country" error={errors.country?.message}>
            <Input
              placeholder="e.g. United States"
              aria-invalid={!!errors.country}
              {...register('country')}
            />
          </Field>

          <Field label="Country Code" error={errors.countryCode?.message}>
            <Input placeholder="+1" aria-invalid={!!errors.countryCode} {...register('countryCode')} />
          </Field>

          <Field label="Phone Number" error={errors.phone?.message}>
            <Input
              placeholder="(555) 000-0000"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
          </Field>

          <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
            <Input type="date" aria-invalid={!!errors.dateOfBirth} {...register('dateOfBirth')} />
          </Field>
        </div>

        <div className="mt-6">
          <Label className="mb-3 block">Gender</Label>
          <RadioGroup
            value={watch('gender')}
            onValueChange={(value) => setValue('gender', value, { shouldValidate: true })}
            className="flex flex-wrap gap-6"
          >
            {options.genders.map((gender) => (
              <div key={gender} className="flex items-center gap-2">
                <RadioGroupItem value={gender} id={`gender-${gender}`} />
                <Label htmlFor={`gender-${gender}`} className="font-normal">
                  {gender}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.gender && (
            <p className="mt-2 text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-end gap-2 border-t pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/employees')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Employee'}
          </Button>
        </div>
      </form>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <GraduationCap className="size-4" />
        HR System Training Session 1
      </p>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn(error && '[&_[aria-invalid=true]]:border-destructive')}>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  )
}
