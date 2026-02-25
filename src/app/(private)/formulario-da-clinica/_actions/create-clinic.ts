'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { db } from '@/db';
import { clinicsTable, usersToClinicsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

const createClinicSchema = z.object({
  clinicName: z.string().min(3),
});
type CreateClinicSchema = z.infer<typeof createClinicSchema>;

export default async function createClinic({ clinicName }: CreateClinicSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Unauthorized');
  }

  const schema = createClinicSchema.safeParse({ clinicName });

  if (!schema.success) {
    throw new Error('Invalid data');
  }

  // ADICIONA À TABELA DE CLÍNICAS O NOME DA CLÍNICA RECEBIDA
  const clinic = await db
    .insert(clinicsTable)
    .values({
      name: schema.data.clinicName,
    })
    .returning();

  // ADICIONA À TABELA INTERMEDIÁRIA DE USÁRIOS E CLÍNICAS OS CAMPOS REFERENTES AO USUÁRIO E A CLÍNICA
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic[0].id,
  });

  revalidatePath('/dashboard');
}
