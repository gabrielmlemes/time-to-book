'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

import { ClinicFormSchema, upsertProfessionalSchema } from '../_schemas/upsert-professional-schema';

export async function createProfessional(data: ClinicFormSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error('Unauthorized');
  }

  const schema = upsertProfessionalSchema.safeParse(data);
  if (!schema.success) {
    throw new Error('Invalid data');
  }

  console.log(schema.data);
}
