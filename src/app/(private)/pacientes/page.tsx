import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Container } from '@/components/ui/page-container';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/auth';

import { PatientsPageHeader } from './_components/header/patients-page-header';
import { PatientDialog } from './_components/table/patient-dialog';
import { PatientsTable } from './_components/table/patients-table';

const PatientsPage = async () => {
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

  // Em breve: listar pacientes

  return (
    <div className="flex flex-col w-full">
      <Container>
        <PatientsPageHeader />
        <Separator className="my-8" />
        <PatientsTable />

        <PatientDialog />
      </Container>
    </div>
  );
};

export default PatientsPage;
