'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { db } from '@/db';
import { patientsTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/next-safe-action';

export const deletePatient = actionClient
  .schema(
    z.object({
      id: z.uuid(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error('Unauthorized');
    }
    const clinicId = session.user.clinic?.id;

    if (!clinicId) {
      throw new Error('Unauthorized');
    }
    const patient = await db.query.patientsTable.findFirst({
      where: eq(patientsTable.id, parsedInput.id),
    });

    if (!patient || patient.clinicId !== clinicId) {
      throw new Error('Unauthorized');
    }

    await db.delete(patientsTable).where(eq(patientsTable.id, parsedInput.id));

    revalidatePath('/pacientes');

    return {
      message: 'Patient deleted',
    };
  });
