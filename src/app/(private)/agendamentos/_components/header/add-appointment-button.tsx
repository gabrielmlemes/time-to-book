'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useAppointmentDialogStore } from '../../_stores/use-appointment-dialog-store';

export function AddAppointmentButton() {
  const { openDialog } = useAppointmentDialogStore();

  return (
    <Button onClick={() => openDialog()}>
      <PlusIcon className="size-4" />
      Novo agendamento
    </Button>
  );
}
