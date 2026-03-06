import { InferSelectModel } from 'drizzle-orm';

import { appointmentsTable } from '@/db/schema';

export type Appointment = InferSelectModel<typeof appointmentsTable>;
