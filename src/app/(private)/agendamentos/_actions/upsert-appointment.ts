'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

import { db } from '@/db';
import { appointmentsTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/next-safe-action';

const upsertAppointmentServerSchema = z.object({
  id: z.uuid().optional(),
  patientId: z.uuid({ message: 'Selecione um paciente' }),
  doctorId: z.uuid({ message: 'Selecione um profissional' }),
  appointmentPriceInCents: z.number().min(1, { message: 'O valor da consulta é obrigatório' }),
  date: z
    .date({ error: 'Selecione uma data válida' })
    .min(new Date(), { message: 'A data deve ser no futuro' }),
  time: z.string().min(1, { message: 'Selecione um horário' }),
});

export const upsertAppointment = actionClient
  .schema(upsertAppointmentServerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user?.clinic?.id) {
      throw new Error('Unauthorized');
    }

    const clinicId = session.user.clinic.id;

    await db
      .insert(appointmentsTable)
      .values({
        ...parsedInput,
        clinicId,
      })
      .onConflictDoUpdate({
        target: [appointmentsTable.id],
        set: {
          ...parsedInput,
          clinicId,
        },
      });

    revalidatePath('/agendamentos');

    return {
      message: 'Appointment saved successfully',
    };
  });
