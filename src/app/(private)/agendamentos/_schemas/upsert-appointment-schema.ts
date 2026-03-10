import { z } from 'zod';

export const upsertAppointmentSchema = z.object({
  patientId: z.uuid({ message: 'Selecione um paciente' }),
  doctorId: z.uuid({ message: 'Selecione um profissional' }),
  appointmentPriceInCents: z.number().min(1, { message: 'O valor da consulta é obrigatório' }),
  date: z
    .date({ error: 'Selecione uma data válida' })
    .min(new Date(), { message: 'A data deve ser no futuro' }),
  time: z.string().min(1, { message: 'Selecione um horário' }),
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>;
