import { z } from 'zod';

// Fonte de verdade dos valores de sexo do paciente
export const PATIENT_SEX_VALUES = ['male', 'female', 'other'] as const;

// Schema Zod reutilizável em formulários e validações
export const patientSexEnumSchema = z.enum(PATIENT_SEX_VALUES);

// Tipo Typescript fortemente tipado: 'male' | 'female' | 'other'
export type PatientSex = (typeof PATIENT_SEX_VALUES)[number];

// Array exportado para uso em UI (ex: popular selects)
export const PATIENT_SEX_OPTIONS = PATIENT_SEX_VALUES;
