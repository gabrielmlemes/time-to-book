'use server';

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

    const { id, name, email, phoneNumber, sex } = parsedInput;

    await db
      .insert(patientsTable)
      .values({
        id,
        name,
        email,
        phoneNumber,
        sex,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          name,
          email,
          phoneNumber,
          sex,
        },
      });

    revalidatePath('/pacientes');

    return {
      message: 'Paciente criado/atualizado com sucesso',
    };
  });
