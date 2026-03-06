import React from 'react';

import {
  PageActions,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { AddAppointmentButton } from './add-appointment-button';

const AppointmentsPageHeader = () => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Agendamentos</PageTitle>
        <PageDescription>Gerencie os agendamentos</PageDescription>
      </PageHeaderContent>

      <PageActions>
        <AddAppointmentButton />
      </PageActions>
    </PageHeader>
  );
};

export default AppointmentsPageHeader;
