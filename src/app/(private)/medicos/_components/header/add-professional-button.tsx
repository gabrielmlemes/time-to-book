'use client';

import { PlusIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import { useProfessionalDialogStore } from '../../_stores/use-professional-dialog-store';

export const AddProfessionalButton = () => {
  const { openDialog } = useProfessionalDialogStore();

  return (
    <Button onClick={() => openDialog()}>
      <PlusIcon className="size-4" />
      Adicionar profissional
    </Button>
  );
};
