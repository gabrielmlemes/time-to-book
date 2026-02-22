import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/lib/auth';

import ClinicForm from './_components/clinic-form';

const ClinicFormPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return <ClinicForm />;
};

export default ClinicFormPage;
