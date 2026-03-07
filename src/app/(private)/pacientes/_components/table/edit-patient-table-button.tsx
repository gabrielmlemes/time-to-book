'use client';

import { EditIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { usePatientDialogStore } from '../../_stores/use-patient-dialog-store';
import { Patient } from '../../_types/patient';

interface EditPatientTableButtonProps {
  patient: Patient;
  onClick?: () => void;
}

export const EditPatientTableButton = ({ patient, onClick }: EditPatientTableButtonProps) => {
  const { openDialog } = usePatientDialogStore();

  return (
    <Button
      variant="ghost"
      className="w-full text-center"
      onClick={() => {
        openDialog(patient);
        onClick?.();
      }}
    >
      <EditIcon className="mr-2 size-4" />
      Editar
    </Button>
  );
};
