import z from 'zod';

import { PHONE_REGEX } from '../../_constants/regex';
import { patientSexEnumSchema } from '../_constants/patient';

// Schema for the core data fields of a patient
export const patientDataSchema = z.object({
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

// Main schema for the upsert action, separating ID from data
export const upsertPatientSchema = z.object({
  id: z.uuid().optional(),
  data: patientDataSchema,
});

export type UpsertPatientSchema = z.infer<typeof patientDataSchema>;
