import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/lib/auth';

import DoctorsPageHeader from './_components/doctors-page-header';

const MedicosPage = async () => {
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

  return <DoctorsPageHeader />;
};

export default MedicosPage;
