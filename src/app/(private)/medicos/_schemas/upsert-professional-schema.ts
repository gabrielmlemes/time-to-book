import z from 'zod';

export const upsertProfessionalSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: 'O nome do profissional é obrigatório' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
    specialty: z
      .string()
      .trim()
      .min(3, { message: 'A especialidade é obrigatória' })
      .max(20, { message: 'A especialidade deve ter no máximo 20 caracteres' }),
    appointmentPriceInCents: z.number().min(1, { message: 'O preço do atendimento é obrigatório' }),
    availableFromWeekday: z.string().min(1, { message: 'O dia de início é obrigatório' }),
    availableToWeekday: z.string().min(1, { message: 'O dia de término é obrigatório' }),
    availableFromTime: z.string().min(1, { message: 'O horário de início é obrigatório' }),
    availableToTime: z.string().min(1, { message: 'O horário de término é obrigatório' }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: 'O horário de início deve ser menor que o horário de término',
      path: ['availableToTime'],
    }
  );
export type UpsertProfessionalSchema = z.infer<typeof upsertProfessionalSchema>;
