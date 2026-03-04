import z from 'zod';

import { PHONE_REGEX } from '../../_constants/regex';
import { patientSexEnumSchema } from '../_constants/regex/patient';

export const upsertPatientSchema = z.object({
  id: z.uuid().optional(),
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome do paciente é obrigatório' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
  email: z
    .email({ message: 'E-mail inválido' })
    .trim()
    .min(1, { message: 'O e-mail é obrigatório' }),
  phoneNumber: z.string().trim().regex(PHONE_REGEX, { message: 'Número de telefone inválido' }),
  sex: patientSexEnumSchema,
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
