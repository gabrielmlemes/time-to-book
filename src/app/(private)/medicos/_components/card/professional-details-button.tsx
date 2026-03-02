'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { Doctor } from '../../_types/doctor';
import { UpsertProfessionalForm } from '../header/upsert-professional-form';

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
