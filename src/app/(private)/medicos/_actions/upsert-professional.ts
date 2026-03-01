'use server';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { db } from '@/db';
import { doctorsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { actionClient } from './../../../../lib/next-safe-action';

const upsertProfessionalServerSchema = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  specialty: z.string(),
  appointmentPriceInCents: z.number(),
  availableFromWeekday: z.number().min(0).max(6),
  availableToWeekday: z.number().min(0).max(6),
  availableFromTime: z.string(),
  availableToTime: z.string(),
});

dayjs.extend(utc);

export const upsertProfessional = actionClient
  .schema(upsertProfessionalServerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error('Unauthorized');
    }

    const availableFromTime = parsedInput.availableFromTime; // 15:00:00
    const availableToTime = parsedInput.availableToTime; // 16:00:00

    const availableFromTimeUTC = dayjs()
      .set('hour', parseInt(availableFromTime.split(':')[0]))
      .set('minute', parseInt(availableFromTime.split(':')[1]))
      .set('second', parseInt(availableFromTime.split(':')[2]))
      .utc(); // converte o availableFromTime para UTC separando hora, minutos e segundos: 15:00:00 -> 12:00:00

    const availableToTimeUTC = dayjs()
      .set('hour', parseInt(availableToTime.split(':')[0]))
      .set('minute', parseInt(availableToTime.split(':')[1]))
      .set('second', parseInt(availableToTime.split(':')[2]))
      .utc(); // converte o availableToTimeUTC para UTC separando hora, minutos e segundos -> 16:00:00 -> 13:00:00

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
        availableFromTime: availableFromTimeUTC.format('HH:mm:ss'), // usamos o .format do dayjs para converter para o formato string pois precisamos salvar no banco como string. Então antes nós recebemos isso como Date e transformamos em string aqui, pro banco.
        availableToTime: availableToTimeUTC.format('HH:mm:ss'), // usamos o .format do dayjs para converter para o formato string pois precisamos salvar no banco como string. Então antes nós recebemos isso como Date e transformamos em string aqui, pro banco.
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          availableFromTime: availableFromTimeUTC.format('HH:mm:ss'),
          availableToTime: availableToTimeUTC.format('HH:mm:ss'),
        },
      });

    revalidatePath('/medicos');

    return {
      message: 'Professional created',
    };
  });
