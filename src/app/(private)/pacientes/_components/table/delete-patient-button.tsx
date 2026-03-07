'use client';
import React from 'react';

import { Button } from '@/components/ui/button';

import { useUpsertPatient } from '../../_hooks/useUpsertPatient';
import { Patient } from '../../_types/patient';

type DeletePatientButtonProps = {
  patient: Patient;
  onSuccess?: () => void;
};

export const DeletePatientButton = ({ patient, onSuccess }: DeletePatientButtonProps) => {
  const { onDelete } = useUpsertPatient({
    patient,
    closeModal: onSuccess, // O hook chama closeModal no onSuccess da action
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
