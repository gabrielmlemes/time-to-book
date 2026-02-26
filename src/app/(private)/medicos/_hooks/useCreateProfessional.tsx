'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { upsertProfessional } from '../_actions/upsert-professional';
import {
  UpsertProfessionalSchema,
  upsertProfessionalSchema,
} from '../_schemas/upsert-professional-schema';

export function useCreateProfessional(closeModal?: () => void) {
  const router = useRouter();

  const form = useForm<UpsertProfessionalSchema>({
    resolver: zodResolver(upsertProfessionalSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      appointmentPriceInCents: 0,
      availableFromTime: '',
      availableToTime: '',
      availableFromWeekday: '1',
      availableToWeekday: '5',
    },
  });

  const upsertProfessionalAction = useAction(upsertProfessional, {
    onSuccess: () => {
      toast.success('Profissional criado com sucesso!');
      form.reset();
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao criar profissional. Tente novamente.');
    },
  });

  async function onSubmit(data: UpsertProfessionalSchema) {
    const formattedData = {
      ...data,
      availableFromWeekday: Number(data.availableFromWeekday),
      availableToWeekday: Number(data.availableToWeekday),
      appointmentPriceInCents: data.appointmentPriceInCents * 100,
    };

    upsertProfessionalAction.execute(formattedData);
  }

  return {
    form,
    onSubmit,
  };
}
