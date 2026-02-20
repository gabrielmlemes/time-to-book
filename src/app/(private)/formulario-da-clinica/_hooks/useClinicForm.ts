import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ClinicFormSchema, clinicFormSchema } from '../_schemas/clinic-form-schema';

export function useClinicForm() {
  const form = useForm<ClinicFormSchema>({
    resolver: zodResolver(clinicFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: ClinicFormSchema) {
    console.log(data);
  }

  return {
    form,
    onSubmit,
  };
}
