import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { Container } from '@/components/ui/page-container';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';

import { getProfessionals } from './_actions/get-professionals';
import AllDoctorsCards from './_components/card/all-doctors-cards';
import DoctorsPageHeader from './_components/header/doctors-page-header';
import { ProfessionalDialog } from './_components/professional-dialog';

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

  const doctors = await getProfessionals();

  return (
    <div className="flex flex-col w-full">
      <Container>
        <DoctorsPageHeader />
        <Separator className="my-8" />
        <AllDoctorsCards doctors={doctors} />
        <ProfessionalDialog />
      </Container>
    </div>
  );
};

export default MedicosPage;
