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
  patientId: z.uuid(),
  doctorId: z.uuid(),
  appointmentPriceInCents: z.number().min(1),
  date: z.date(),
  // Time serÃ¡ ignorado por enquanto conforme instruÃ§Ãµes da task
});

export const upsertAppointment = actionClient
  .schema(upsertAppointmentServerSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
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
