import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { Container } from '@/components/ui/page-container';
import { auth } from '@/lib/auth';

import { DashboardPageHeader } from './_components/dashboard-page-header';

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
    <Container>
      <DashboardPageHeader />
    </Container>
  );
};

export default DashboardPage;
