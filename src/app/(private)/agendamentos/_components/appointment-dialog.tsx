'use client';

import dynamic from 'next/dynamic';

import { Dialog } from '@/components/ui/dialog';

import { Patient } from '../../pacientes/_types/patient';
import { Doctor } from '../../profissionais/_types/doctor';
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
          appointment={appointment} // -> Esse 'appointment' vem do hook, que será vazio inicialmente para poder abrir o formulário vazio para criação de um novo agendamento, diferente do 'existingAppointments' onde de fato tem os agendamentos, por virem do chamada getAppointment(), recebidos via prop do componente pai.
          patients={patients}
          doctors={doctors}
          existingAppointments={existingAppointments}
        />
      )}
    </Dialog>
  );
}
