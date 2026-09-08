import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { ApiError, type EmployeeInput, type EmployeeOptions } from '@/lib/types'
import { cn } from '@/lib/utils'

const MINIMUM_AGE = 18

function yearsAgo(years: number): Date {
  const date = new Date()
  date.setFullYear(date.getFullYear() - years)
  return date
}

/**
 * Mirrors the backend's rules so users get immediate feedback. The API re-checks
 * everything — this is for responsiveness, not enforcement.
 */
const schema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    email: z.string().trim().email('Enter a valid email address.'),
    nationalId: z.string().trim().min(3, 'National ID is required.'),
    countryCode: z.string().trim().regex(/^\+\d{1,4}$/, "Use a '+' followed by 1-4 digits."),
    phone: z.string().trim().min(5, 'Phone number is required.'),
    country: z.string().trim().min(1, 'Country is required.'),
    gender: z.string().min(1, 'Select a gender.'),
    officialTitle: z.string().min(1, 'Select a job title.'),
    dateOfBirth: z.string().min(1, 'Date of birth is required.'),
    hireDate: z.string().min(1, 'Hire date is required.'),
  })
  .superRefine((values, ctx) => {
    const birth = new Date(values.dateOfBirth)
    const hire = new Date(values.hireDate)
    const today = new Date()

    if (birth >= today) {
      ctx.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: 'Date of birth must be in the past.',
      })
    } else if (birth > yearsAgo(MINIMUM_AGE)) {
      ctx.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: `Employee must be at least ${MINIMUM_AGE} years old.`,
      })
    }

    if (hire > today) {
      ctx.addIssue({
        code: 'custom',
        path: ['hireDate'],
        message: 'Hire date cannot be in the future.',
      })
    }

    const eighteenthBirthday = new Date(birth)
    eighteenthBirthday.setFullYear(birth.getFullYear() + MINIMUM_AGE)
    if (hire < eighteenthBirthday) {
      ctx.addIssue({
        code: 'custom',
        path: ['hireDate'],
        message: `Hire date cannot be before the employee turned ${MINIMUM_AGE}.`,
      })
    }
  })

type FormValues = z.infer<typeof schema>

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

  const [options, setOptions] = useState<EmployeeOptions>({ genders: [], titles: [] })
  const [isLoading, setIsLoading] = useState(isEdit)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    async function load() {
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
        toast.error(error instanceof ApiError ? error.message : 'Failed to load the form.')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [id, isEdit, reset])

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
        for (const [key, messages] of entries) {
          const field = (key.charAt(0).toLowerCase() + key.slice(1)) as keyof FormValues
          if (field in EMPTY) {
            setError(field, { message: messages.join(' ') })
          }
        }
        toast.error(entries.length > 0 ? 'Please fix the highlighted fields.' : error.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  if (isLoading) {
    return <p className="py-20 text-center text-muted-foreground">Loading…</p>
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
