'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { db } from '@/db';
import { doctorsTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { actionClient } from '@/lib/next-safe-action';

export const deleteDoctor = actionClient
  .schema(
    z.object({
      id: z.string(),
    })
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error('Unauthorized');
    }

    // garantir que o usuário só possa excluir um médico se o médico for da mesma clínica do usuário
    const clinicId = session.user.clinic?.id;

    if (!clinicId) {
      throw new Error('Unauthorized');
    }

    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.id),
    });

    if (!doctor || doctor.clinicId !== clinicId) {
      throw new Error('Unauthorized');
    }

    await db.delete(doctorsTable).where(eq(doctorsTable.id, parsedInput.id));

    revalidatePath('/profissionais');

    return {
      message: 'Professional deleted',
    };
  });
