'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { deleteAppointment } from '../_actions/delete-appointment';
import { upsertAppointment } from '../_actions/upsert-appointment';
import {
  UpsertAppointmentSchema,
  upsertAppointmentSchema,
} from '../_schemas/upsert-appointment-schema';
import { Appointment } from '../_types/appointment';

type UseUpsertAppointmentProps = {
  closeModal?: () => void;
  appointment?: Appointment;
};

export function useUpsertAppointment({ closeModal, appointment }: UseUpsertAppointmentProps) {
  const router = useRouter();

  const form = useForm<UpsertAppointmentSchema>({
    resolver: zodResolver(upsertAppointmentSchema),
    mode: 'onSubmit',
    defaultValues: {
      patientId: appointment?.patientId ?? '',
      doctorId: appointment?.doctorId ?? '',
      appointmentPriceInCents: appointment?.appointmentPriceInCents
        ? appointment.appointmentPriceInCents / 100
        : 0,
      date: appointment?.date ? new Date(appointment.date) : undefined,
    },
  });

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess: () => {
      toast.success(
        appointment ? 'Agendamento atualizado com sucesso.' : 'Agendamento criado com sucesso.'
      );
      form.reset();
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error(appointment ? 'Erro ao atualizar agendamento.' : 'Erro ao criar agendamento.');
    },
  });

  async function onSubmit(data: UpsertAppointmentSchema) {
    upsertAppointmentAction.execute({
      ...data,
      appointmentPriceInCents: data.appointmentPriceInCents * 100,
      id: appointment?.id,
    });
  }

  const deleteAppointmentAction = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success('Agendamento deletado com sucesso.');
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao deletar agendamento.');
    },
  });

  async function onDelete({ id }: { id: string }) {
    deleteAppointmentAction.execute({ id });
  }

  return {
    form,
    onSubmit,
    onDelete,
    isLoading: upsertAppointmentAction.isPending || deleteAppointmentAction.isPending,
  };
}
