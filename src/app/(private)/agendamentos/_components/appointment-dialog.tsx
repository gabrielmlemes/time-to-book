'use client';

import dynamic from 'next/dynamic';

import { Dialog } from '@/components/ui/dialog';

import { Doctor } from '../../medicos/_types/doctor';
import { Patient } from '../../pacientes/_types/patient';
import { useAppointmentDialogStore } from '../_stores/use-appointment-dialog-store';

const UpsertAppointmentForm = dynamic(
  () => import('./upsert-appointment-form').then((mod) => mod.UpsertAppointmentForm),
  {
    ssr: false,
  }
);

interface AppointmentDialogProps {
  patients: Patient[];
  doctors: Doctor[];
  existingAppointments: { id: string; date: Date; doctorId: string }[];
}

export function AppointmentDialog({
  patients,
  doctors,
  existingAppointments,
}: AppointmentDialogProps) {
  const { isOpen, closeDialog, appointment } = useAppointmentDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {isOpen && (
        <UpsertAppointmentForm
          setOpen={closeDialog}
          appointment={appointment}
          patients={patients}
          doctors={doctors}
          existingAppointments={existingAppointments}
        />
      )}
    </Dialog>
  );
}
