'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import { useUpsertAppointment } from '../../_hooks/useUpsertAppointment';
import { Appointment } from '../../_types/appointment';

type DeleteAppointmentButtonProps = {
  appointment: Appointment;
  onSuccess?: () => void;
};

export const DeleteAppointmentButton = ({
  appointment,
  onSuccess,
}: DeleteAppointmentButtonProps) => {
  const { onDelete, isLoading } = useUpsertAppointment({
    appointment,
    closeModal: onSuccess, // O hook chama closeModal no onSuccess da action
  });

  return (
    <Button
      variant="destructive"
      className="flex-1"
      disabled={isLoading}
      onClick={async (e) => {
        e.preventDefault();
        await onDelete({ id: appointment.id });
      }}
    >
      Deletar
    </Button>
  );
};
