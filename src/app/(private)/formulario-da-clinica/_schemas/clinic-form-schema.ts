import z from 'zod';

export const clinicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome da clínica é obrigatório' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
});
export type ClinicFormSchema = z.infer<typeof clinicFormSchema>;
