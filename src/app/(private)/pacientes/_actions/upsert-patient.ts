'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { db } from '@/db';
import { patientsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { actionClient } from '../../../../lib/next-safe-action';
import { upsertPatientSchema } from '../_schemas/upsert-patient-schema';

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error('Unauthorized');
    }

    const { id, data } = parsedInput;

    if (id) {
      // Logic for UPDATE: Use the 'data' object to set values.
      await db.update(patientsTable).set(data).where(eq(patientsTable.id, id));
    } else {
      // Logic for CREATE: Spread the 'data' object and add the clinicId.
      await db.insert(patientsTable).values({
        ...data,
        clinicId: session.user.clinic.id,
      });
    }

    revalidatePath('/pacientes');

    return {
      message: `Paciente ${id ? 'atualizado' : 'criado'} com sucesso.`,
    };
  });
