import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/lib/auth';

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect('/login');
  }

  const userWithoutClinic = session?.user?.clinic.id === undefined;
  if (userWithoutClinic) {
    redirect('/formulario-da-clinica');
  }

  return (
    <>
      <p>{session?.user?.name}</p>
    </>
  );
};

export default DashboardPage;
