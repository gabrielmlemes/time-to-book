'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { deletePatient } from '../_actions/delete-patient';
import { upsertPatient } from '../_actions/upsert-patient';
import { patientDataSchema, UpsertPatientSchema } from '../_schemas/upsert-patient-schema';
import type { Patient } from '../_types/patient';

type UseUpsertPatientProps = {
  closeModal?: () => void;
  patient?: Patient;
};

export function useUpsertPatient({ closeModal, patient }: UseUpsertPatientProps) {
  const router = useRouter();

  const form = useForm<UpsertPatientSchema>({
    resolver: zodResolver(patientDataSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      sex: patient?.sex ?? 'male',
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
    upsertPatientAction.execute({
      id: patient?.id,
      data: data,
    });
  }

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success('Paciente deletado com sucesso.');
      closeModal?.();
      router.refresh();
    },
    onError: () => {
      toast.error('Erro ao deletar paciente.');
      closeModal?.();
      router.refresh();
    },
  });

  async function onDelete({ id }: { id: string }) {
    deletePatientAction.execute({ id });
  }

  return {
    form,
    onSubmit,
    onDelete,
  };
}
