'use client';

import { PencilIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import { usePatientDialogStore } from '../../_stores/use-patient-dialog-store';
import type { Patient } from '../../_types/patient';

type PatientsDetailsButtonProps = {
  patient: Patient;
};

export const PatientsDetailsButton = ({ patient }: PatientsDetailsButtonProps) => {
  const { openDialog } = usePatientDialogStore();
  console.log('paciente clicado: ', patient);

  return (
    <Button className="w-full" onClick={() => openDialog(patient)} variant="ghost">
      <PencilIcon className="w-4 h-4" />
      Editar
    </Button>
  );
};
