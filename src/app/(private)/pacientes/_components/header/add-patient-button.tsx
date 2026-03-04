'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { usePatientDialogStore } from '../../_stores/use-patient-dialog-store';

export const AddPatientButton = () => {
  const { openDialog } = usePatientDialogStore();

  return (
    <Button onClick={() => openDialog()}>
      <PlusIcon className="size-4" />
      Adicionar paciente
    </Button>
  );
};
