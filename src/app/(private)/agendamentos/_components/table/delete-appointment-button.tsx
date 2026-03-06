'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import { useUpsertAppointment } from '../../_hooks/useUpsertAppointment';
import { Appointment } from '../../_types/appointment';

type DeleteAppointmentButtonProps = {
  appointment: Appointment;
};

export const DeleteAppointmentButton = ({ appointment }: DeleteAppointmentButtonProps) => {
  const { onDelete, isLoading } = useUpsertAppointment({
    appointment,
  });

  return (
    <Button
      variant="destructive"
      className="flex-1"
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        onDelete({ id: appointment.id });
      }}
    >
      Deletar
    </Button>
  );
};
