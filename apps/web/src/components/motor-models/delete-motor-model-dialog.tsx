'use client';

import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDeleteMotorModel } from '@/hooks/use-motor-models';
import { extractErrorMessage } from '@/lib/api-client';
import type { MotorModel } from '@/types/api';

export function DeleteMotorModelDialog({ motorModel }: { motorModel: MotorModel }) {
  const deleteMotorModel = useDeleteMotorModel();

  async function handleDelete() {
    try {
      await deleteMotorModel.mutateAsync(motorModel.id);
      toast.success(`${motorModel.name} berhasil dihapus`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  return (
    <AlertDialog>
            <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus {motorModel.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Jika ada customer yang masih menandai motor ini
            sebagai minat mereka, penghapusan bisa gagal karena relasi data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}