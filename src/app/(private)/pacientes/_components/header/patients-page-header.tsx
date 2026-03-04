import React from 'react';

import {
  PageActions,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { AddPatientButton } from './add-patient-button';

const PatientsPageHeader = () => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Pacientes</PageTitle>
        <PageDescription>Gerencie os pacientes da sua clínica.</PageDescription>
      </PageHeaderContent>

      <PageActions>
        <AddPatientButton />
      </PageActions>
    </PageHeader>
  );
};

export { PatientsPageHeader };
