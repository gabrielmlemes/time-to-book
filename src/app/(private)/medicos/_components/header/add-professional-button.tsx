'use client';

import { PlusIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const UpsertProfessionalForm = dynamic(
  () => import('./upsert-professional-form').then((mod) => mod.UpsertProfessionalForm),
  { ssr: false, loading: () => <Skeleton /> }
);

export const AddProfessionalButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Adicionar médico
        </Button>
      </DialogTrigger>

      {open && <UpsertProfessionalForm setOpen={setOpen} />}
    </Dialog>
  );
};
