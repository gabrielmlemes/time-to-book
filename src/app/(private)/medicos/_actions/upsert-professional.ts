'use server';
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

export const upsertProfessional = actionClient
  .schema(upsertProfessionalServerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error('Unauthorized');
    }

    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
        },
      });

    revalidatePath('/medicos');

    return {
      message: 'Professional created',
    };
  });
