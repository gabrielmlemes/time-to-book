import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { Container } from '@/components/ui/page-container';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';

import { getPatients } from '../pacientes/_actions/get-patients';
import { getProfessionals } from '../profissionais/_actions/get-professionals';
import { getAppointments } from './_actions/get-appointments';
import { AppointmentDialog } from './_components/appointment-dialog';
import AppointmentsPageHeader from './_components/header/appointments-page-header';
import { AppointmentsTable } from './_components/table';

const AppointmentsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/login');
  }

  const userWithoutClinic = session?.user?.clinic.id === undefined;
  if (userWithoutClinic) {
    redirect('/formulario-da-clinica');
  }

  const [patients, doctors, appointments] = await Promise.all([
    getPatients(),
    getProfessionals(),
    getAppointments(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <Container>
        <AppointmentsPageHeader />
        <Separator className="my-8" />

        <AppointmentsTable />

        <AppointmentDialog
          patients={patients}
          doctors={doctors}
          existingAppointments={appointments}
        />
      </Container>
    </div>
  );
};

export default AppointmentsPage;
