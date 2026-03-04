import { patientsTable } from '@/db/schema';

export type Patient = typeof patientsTable.$inferSelect;
