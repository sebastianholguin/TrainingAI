import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { DeleteEmployeeDialog } from '@/components/DeleteEmployeeDialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { formatDate, initials } from '@/lib/format'
import { ApiError, type Employee } from '@/lib/types'

export function EmployeeDirectory() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  async function load() {
    setIsLoading(true)
    setLoadError(null)
    try {
      setEmployees(await api.listEmployees())
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Failed to load employees.')
    } finally {
      setIsLoading(false)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await api.deleteEmployee(pendingDelete.id)
      toast.success(`${pendingDelete.name} was deleted.`)
      setPendingDelete(null)
      await load()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to delete employee.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employee Directory</h2>
          <p className="mt-1 text-muted-foreground">Manage and view all personnel records</p>
        </div>
        <Button onClick={() => navigate('/employees/new')}>
          <Plus className="size-4" />
          Add Employee
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {['Name', 'National ID', 'Title', 'Hire Date', 'Country', 'Gender', 'Email'].map(
                (heading) => (
                  <TableHead
                    key={heading}
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {heading}
                  </TableHead>
                ),
              )}
              <TableHead className="text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  Loading employees…
                </TableCell>
              </TableRow>
            )}

            {!isLoading && loadError && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center">
                  <p className="text-destructive">{loadError}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => void load()}>
                    Try again
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !loadError && employees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No employees yet. Add the first one to get started.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !loadError &&
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {initials(employee.name)}
                      </span>
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.nationalId}</TableCell>
                  <TableCell>{employee.officialTitle}</TableCell>
                  <TableCell>{formatDate(employee.hireDate)}</TableCell>
                  <TableCell>{employee.country}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  <TableCell>
                    <a href={`mailto:${employee.email}`} className="text-primary hover:underline">
                      {employee.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${employee.name}`}
                        onClick={() => navigate(`/employees/${employee.id}/edit`)}
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${employee.name}`}
                        onClick={() => setPendingDelete(employee)}
                      >
                        <Trash2 className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <DeleteEmployeeDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        isDeleting={isDeleting}
      />
    </>
  )
}
