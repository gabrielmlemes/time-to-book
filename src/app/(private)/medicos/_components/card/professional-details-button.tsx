'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import { useProfessionalDialogStore } from '../../_stores/use-professional-dialog-store';
import { Doctor } from '../../_types/doctor';

type ProfessionalDetailsButtonProps = {
  doctor: Doctor;
};

export const ProfessionalDetailsButton = ({ doctor }: ProfessionalDetailsButtonProps) => {
  const { openDialog } = useProfessionalDialogStore();

  return (
    <Button className="w-full" onClick={() => openDialog(doctor)}>
      Ver detalhes
    </Button>
  );
};
