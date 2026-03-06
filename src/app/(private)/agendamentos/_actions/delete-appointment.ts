'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

import { db } from '@/db';
import { appointmentsTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/next-safe-action';

const deleteAppointmentSchema = z.object({
  id: z.uuid(),
});

export const deleteAppointment = actionClient
  .schema(deleteAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized');
    }

    if (!session.user.clinic) {
      throw new Error('Unauthorized');
    }

    if (!parsedInput.id) {
      throw new Error('Invalid input');
    }

    await db
      .delete(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.id, parsedInput.id),
          eq(appointmentsTable.clinicId, session.user.clinic.id)
        )
      );

    revalidatePath('/agendamentos');

    return {
      message: 'Appointment deleted successfully',
    };
  });
