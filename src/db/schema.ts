import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';

// TABELA DE USUÁRIOS
export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
});

// RELACIONAMENTOS DO USUÁRIO
export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable), // UM USUÁRIO PODE TER MUITAS CLÍNICAS
}));

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
  userId: uuid('user_id')
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
