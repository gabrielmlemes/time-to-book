'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { upsertPatient } from '../_actions/upsert-patient';
import { UpsertPatientSchema, upsertPatientSchema } from '../_schemas/upsert-patient-schema';

type UseUpsertPatientProps = {
  closeModal?: () => void;
};

export function useUpsertPatient({ closeModal }: UseUpsertPatientProps) {
  const router = useRouter();

  const form = useForm<UpsertPatientSchema>({
    resolver: zodResolver(upsertPatientSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      sex: 'male',
    },
  });

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success('Paciente salvo com sucesso.');
      form.reset();
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao salvar paciente.');
      closeModal?.();
      router.refresh();
    },
  });

  function onSubmit(data: UpsertPatientSchema) {
    upsertPatientAction.execute(data);
  }

  return {
    form,
    onSubmit,
  };
}
