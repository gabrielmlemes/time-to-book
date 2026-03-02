'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { Doctor } from '../../_types/doctor';

const UpsertProfessionalForm = dynamic(
  () => import('../header/upsert-professional-form').then((mod) => mod.UpsertProfessionalForm),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[550px] w-[450px]" />,
  }
);

type ProfessionalDetailsButtonProps = {
  doctor: Doctor;
};

const ProfessionalDetailsButton = ({ doctor }: ProfessionalDetailsButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Ver detalhes</Button>
      </DialogTrigger>

      {open && <UpsertProfessionalForm setOpen={setOpen} doctor={doctor} />}
    </Dialog>
  );
};

export default ProfessionalDetailsButton;
