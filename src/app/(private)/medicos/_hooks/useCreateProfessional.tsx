'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createProfessional } from '../_actions/create-professional';
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
      appointmentPrice: 0,
      availableFromTime: '',
      availableToTime: '',
      availableFromWeekday: '1',
      availableToWeekday: '5',
    },
  });

  async function onSubmit(data: UpsertProfessionalSchema) {
    try {
      await createProfessional(data);
      toast.success('Profissional criado com sucesso!');
      form.reset();
      closeModal?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar profissional. Tente novamente.');
    }
  }

  return {
    form,
    onSubmit,
  };
}
