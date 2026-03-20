import React from 'react';

import {
  PageActions,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

import { DatePickerWithRange } from './range-picker';

const DashboardPageHeader = () => {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageTitle>Dashboard</PageTitle>
        <PageDescription>Visualização geral</PageDescription>
      </PageHeaderContent>

      <PageActions>
        <DatePickerWithRange />
      </PageActions>
    </PageHeader>
  );
};

export { DashboardPageHeader };
