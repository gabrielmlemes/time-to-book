'use client';

import { EditIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useAppointmentDialogStore } from '../../_stores/use-appointment-dialog-store';
import { Appointment } from '../../_types/appointment';

interface EditAppointmentTableButtonProps {
  appointment: Appointment;
}

export const EditAppointmentTableButton = ({ appointment }: EditAppointmentTableButtonProps) => {
  const { openDialog } = useAppointmentDialogStore();

  return (
    <Button variant="ghost" className="w-full text-center" onClick={() => openDialog(appointment)}>
      <EditIcon className="mr-2 size-4" />
      Editar
    </Button>
  );
};
