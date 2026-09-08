import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
}

/** Matches `Delete Confirmation.png`. */
export function DeleteEmployeeDialog({ open, onOpenChange, onConfirm, isDeleting }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[440px] text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="size-7 text-destructive" />
        </div>

        <AlertDialogTitle className="text-center text-xl font-bold">
          Delete Employee?
        </AlertDialogTitle>

        <AlertDialogDescription className="text-center text-muted-foreground">
          Are you sure you want to delete this record? This action cannot be undone and will
          permanently remove all data associated with this employee.
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-2 grid grid-cols-2 gap-3 sm:space-x-0">
          <AlertDialogCancel disabled={isDeleting} className="mt-0 w-full">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              // Keep the dialog mounted while the request is in flight so the
              // pending state is visible; the caller closes it on success.
              event.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="w-full bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
