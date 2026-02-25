import React from 'react';

import {
  Container,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { AddProfessionalButton } from './add-professional-button';

const DoctorsPageHeader = () => {
  return (
    <Container>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Medicos</PageTitle>
          <PageDescription>Gerencie os médicos de sua clínica</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <AddProfessionalButton />
        </PageActions>
      </PageHeader>

      <PageContent>médicos</PageContent>
    </Container>
  );
};

export default DoctorsPageHeader;
