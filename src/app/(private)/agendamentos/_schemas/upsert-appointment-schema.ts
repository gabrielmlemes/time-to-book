import { z } from 'zod';

export const upsertAppointmentSchema = z.object({
  patientId: z.uuid().min(1, { message: 'Selecione um paciente' }),
  doctorId: z.uuid().min(1, { message: 'Selecione um profissional' }),
  appointmentPriceInCents: z.number().min(1, { message: 'O valor da consulta é obrigatório' }),
  date: z.date().refine((value) => !!value, {
    message: 'Selecione uma data válida',
  }),
  // Horário será adicionado futuramente, por enquanto deixamos como opcional ou apenas no schema de UI
  time: z.string().min(1, { message: 'Selecione um horário' }),
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>;
