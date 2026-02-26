'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';

import { db } from '@/db';
import { doctorsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

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
type UpsertProfessionalServerSchema = z.infer<typeof upsertProfessionalServerSchema>;

export async function upsertProfessional(data: UpsertProfessionalServerSchema) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error('Unauthorized');
  }

  const schema = upsertProfessionalServerSchema.safeParse(data);
  if (!schema.success) {
    throw new Error('Invalid data');
  }

  await db
    .insert(doctorsTable)
    .values({
      ...schema.data,
      clinicId: session.user.clinic.id,
    })
    .onConflictDoUpdate({
      target: [doctorsTable.id],
      set: {
        ...schema.data,
      },
    });

  revalidatePath('/medicos');

  return {
    message: 'Professional created',
  };
}
