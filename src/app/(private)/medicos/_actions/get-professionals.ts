'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { doctorsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function getProfessionals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error('Unauthorized');
  }

  await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session.user.clinic.id), // Busca todos os médicos que são da mesma clínica que a clínica que o usuário está logado.
  });
}
