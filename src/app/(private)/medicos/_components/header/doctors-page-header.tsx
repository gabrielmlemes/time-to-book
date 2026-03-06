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
        <PageTitle>Profissionais</PageTitle>
        <PageDescription>Gerencie os profissionais</PageDescription>
      </PageHeaderContent>

      <PageActions>
        <AddProfessionalButton />
      </PageActions>
    </PageHeader>
  );
};

export default DoctorsPageHeader;
