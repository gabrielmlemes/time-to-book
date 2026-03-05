'use client';
import React from 'react';

import { Button } from '@/components/ui/button';

import { useUpsertPatient } from '../../_hooks/useUpsertPatient';
import { Patient } from '../../_types/patient';

type DeletePatientButtonProps = {
  patient: Patient;
};

export const DeletePatientButton = ({ patient }: DeletePatientButtonProps) => {
  const { onDelete } = useUpsertPatient({
    patient,
  });

  return (
    <Button
      variant="destructive"
      className="flex-1"
      onClick={(e) => {
        e.preventDefault();
        onDelete({ id: patient.id });
      }}
    >
      Deletar
    </Button>
  );
};
