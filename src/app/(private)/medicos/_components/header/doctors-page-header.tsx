import React from 'react';

import {
  PageActions,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { AddProfessionalButton } from './add-professional-button';

const DoctorsPageHeader = () => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Medicos</PageTitle>
        <PageDescription>Gerencie os médicos de sua clínica</PageDescription>
      </PageHeaderContent>

      <PageActions>
        <AddProfessionalButton />
      </PageActions>
    </PageHeader>
  );
};

export default DoctorsPageHeader;
