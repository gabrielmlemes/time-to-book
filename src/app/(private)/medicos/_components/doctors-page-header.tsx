import { PlusIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Container,
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container';

const DoctorsPageHeader = () => {
  return (
    <Container>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Medicos</PageTitle>
          <PageDescription>Gerencie os médicos de sua clínica</PageDescription>
        </PageHeaderContent>

        <PageActions>
          <Button>
            <PlusIcon className="size-4" />
            Adicionar médico
          </Button>
        </PageActions>
      </PageHeader>

      <PageContent>médicos</PageContent>
    </Container>
  );
};

export default DoctorsPageHeader;
