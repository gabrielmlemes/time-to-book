'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
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

dayjs.extend(utc);

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
      time: appointment?.date ? dayjs(appointment.date).local().format('HH:mm') : '',
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
    // Combinar Data e Hora
    const combinedDate = dayjs(data.date)
      .set('hour', parseInt(data.time.split(':')[0]))
      .set('minute', parseInt(data.time.split(':')[1]))
      .set('second', 0)
      .toDate();

    upsertAppointmentAction.execute({
      ...data,
      date: combinedDate,
      appointmentPriceInCents: Math.round(data.appointmentPriceInCents * 100),
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
