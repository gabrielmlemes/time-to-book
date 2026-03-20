'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { deleteDoctor } from '../_actions/delete-doctor';
import { upsertProfessional } from '../_actions/upsert-professional';
import { getAvailability } from '../_helpers/availability';
import {
  UpsertProfessionalSchema,
  upsertProfessionalSchema,
} from '../_schemas/upsert-professional-schema';
import { Doctor } from '../_types/doctor';

type useUpsertProfessionalProps = {
  closeModal?: () => void;
  doctor?: Doctor;
};

export function useUpsertProfessional({ closeModal, doctor }: useUpsertProfessionalProps) {
  const router = useRouter();

  const availability = doctor ? getAvailability(doctor) : undefined;

  const form = useForm<UpsertProfessionalSchema>({
    resolver: zodResolver(upsertProfessionalSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: doctor?.name ?? '',
      specialty: doctor?.specialty ?? '',
      appointmentPriceInCents: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100 // Cálculo necessário pois no banco é salvo em centavos.
        : 0,
      availableFromTime: availability ? availability.from.format('HH:mm:ss') : '',
      availableToTime: availability ? availability.to.format('HH:mm:ss') : '',
      availableFromWeekday: doctor?.availableFromWeekday?.toString() ?? '1',
      availableToWeekday: doctor?.availableToWeekday?.toString() ?? '5',
    },
  });

  const upsertProfessionalAction = useAction(upsertProfessional, {
    onSuccess: () => {
      toast.success(
        doctor ? 'Profissional atualizado com sucesso.' : 'Profissional criado com sucesso.'
      );
      form.reset();
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error(doctor ? 'Erro ao atualizar profissional.' : 'Erro ao criar profissional.');
      closeModal?.();
      router.refresh();
    },
  });

  async function onSubmit(data: UpsertProfessionalSchema) {
    const formattedData = {
      ...data,
      availableFromWeekday: Number(data.availableFromWeekday),
      availableToWeekday: Number(data.availableToWeekday),
      appointmentPriceInCents: Math.round(data.appointmentPriceInCents * 100),
      id: doctor?.id,
    };

    upsertProfessionalAction.execute(formattedData);
  }

  const deleteProfessionalAction = useAction(deleteDoctor, {
    onSuccess: () => {
      toast.success('Profissional deletado com sucesso.');
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao deletar profissional.');
      closeModal?.();
      router.refresh();
    },
  });

  async function onDelete({ id }: { id: string }) {
    deleteProfessionalAction.execute({ id });
  }

  return {
    form,
    onSubmit,
    onDelete,
  };
}
