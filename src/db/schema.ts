import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// TABELA DE USUÁRIOS
export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// RELACIONAMENTOS DO USUÁRIO
export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable), // UM USUÁRIO PODE TER MUITAS CLÍNICAS
}));

// ___________________________________________________________________________________________

// TABELA DE SESSÕES
export const sessionsTable = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});

// TABELA DE CONTAS
export const accountsTable = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// TABELA DE VERIFICAÇÕES
export const verificationsTable = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// ___________________________________________________________________________________________

// TABELA DE CLÍNICAS
export const clinicsTable = pgTable('clinics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// RELACIONAMENTOS DA CLÍNICA
export const clinicsTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable), // UMA CLÍNICA PODE TER MUITOS DOUTORES
  patients: many(patientsTable), // UMA CLÍNICA PODE TER MUITOS PACIENTES
  appointments: many(appointmentsTable), // UMA CLÍNICA PODE TER MUITOS AGENDAMENTOS
  usersToClinics: many(usersToClinicsTable), // UMA CLÍNICA PODE TER MUITOS USUÁRIOS
}));

// TABELA INTERMEDIÁRIA QUE LIGA UM USUÁRIO À UMA CLÍNICA
export const usersToClinicsTable = pgTable('users_to_clinics', {
  userId: text('user_id')
    .references(() => usersTable.id)
    .notNull(),
  clinicId: uuid('clinic_id')
    .notNull()
    .references(() => clinicsTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// RELACIONAMENTOS DA TABELA INTERMEDIÁRIA
export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToClinicsTable.userId],
    references: [usersTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [usersToClinicsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

// ___________________________________________________________________________________________

// TABELA DE DOUTORES
export const doctorsTable = pgTable('doctors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  clinicId: uuid('clinic_id')
    .references(() => clinicsTable.id, { onDelete: 'cascade' })
    .notNull(),
  avatarImageUrl: text('avatar_image_url'),
  // 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday, 0 = Sunday
  availableFromWeekday: integer('available_from_weekday').notNull(), // 1
  availableToWeekday: integer('available_to_weekday').notNull(), // 5
  availableFromTime: time('available_from_time').notNull(),
  availableToTime: time('available_to_time').notNull(),
  specialty: text('specialty').notNull(),
  appointmentPriceInCents: integer('appointment_price_in_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// RELACIONAMENTOS DO DOUTOR
export const doctorsTableRelations = relations(doctorsTable, ({ many, one }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }), // UM DOUTOR PODE TER UMA CLÍNICA
  appointments: many(appointmentsTable), // UM DOUTOR PODE TER MUITOS AGENDAMENTOS
}));

// ___________________________________________________________________________________________

export const patientSexEnum = pgEnum('patient_sex', ['male', 'female', 'other']);

// TABELA DE PACIENTES
export const patientsTable = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  clinicId: uuid('clinic_id')
    .references(() => clinicsTable.id, { onDelete: 'cascade' }) // DELETAR O PACIENTE SE A CLÍNICA FOR DELETADA
    .notNull(),
  email: text('email').notNull().unique(),
  phoneNumber: text('phone_number').notNull(),
  sex: patientSexEnum('sex').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// RELACIONAMENTOS DO PACIENTE
export const patientsTableRelations = relations(patientsTable, ({ many, one }) => ({
  clinic: one(clinicsTable, {
    fields: [patientsTable.clinicId],
    references: [clinicsTable.id],
  }), // UM PACIENTE PODE TER UMA CLÍNICA
  appointments: many(appointmentsTable), // UM PACIENTE PODE TER MUITOS AGENDAMENTOS
}));

// ___________________________________________________________________________________________

// TABELA DE AGENDAMENTOS
export const appointmentsTable = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: timestamp('date').notNull(),
  patientId: uuid('patient_id')
    .references(() => patientsTable.id, { onDelete: 'cascade' }) // DELETAR O PACIENTE SE O AGENDAMENTO FOR DELETADO
    .notNull(),
  doctorId: uuid('doctor_id')
    .references(() => doctorsTable.id, { onDelete: 'cascade' }) // DELETAR O DOUTOR SE O AGENDAMENTO FOR DELETADO
    .notNull(),
  clinicId: uuid('clinic_id')
    .references(() => clinicsTable.id, { onDelete: 'cascade' }) // DELETAR A CLÍNICA SE O AGENDAMENTO FOR DELETADO
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// RELACIONAMENTOS DO AGENDAMENTO
export const appointmentsTableRelations = relations(appointmentsTable, ({ one }) => ({
  patient: one(patientsTable, {
    fields: [appointmentsTable.patientId],
    references: [patientsTable.id],
  }), // UM AGENDAMENTO PODE TER UM PACIENTE
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }), // UM AGENDAMENTO PODE TER UM DOUTOR
  clinic: one(clinicsTable, {
    fields: [appointmentsTable.clinicId],
    references: [clinicsTable.id],
  }), // UM AGENDAMENTO PODE TER UMA CLÍNICA
}));
