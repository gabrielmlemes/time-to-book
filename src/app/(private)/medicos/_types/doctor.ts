import { doctorsTable } from '@/db/schema';

export type Doctor = typeof doctorsTable.$inferSelect;
