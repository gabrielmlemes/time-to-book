'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import createClinic from '../_actions/create-clinic';
import { ClinicFormSchema, clinicFormSchema } from '../_schemas/clinic-form-schema';

export function useClinicForm(closeModal?: () => void) {
  const router = useRouter();

  const form = useForm<ClinicFormSchema>({
    resolver: zodResolver(clinicFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: ClinicFormSchema) {
    try {
      await createClinic({
        clinicName: data.name,
      });
      toast.success('Clínica criada com sucesso!');
      form.reset();
      closeModal?.();
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar clínica. Tente novamente.');
    }
  }

  return {
    form,
    onSubmit,
  };
}
