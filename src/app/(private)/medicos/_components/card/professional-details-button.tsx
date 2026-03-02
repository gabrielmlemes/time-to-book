'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import { UpsertProfessionalForm } from '../header/upsert-professional-form';

const ProfessionalDetailsButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Ver detalhes</Button>
      </DialogTrigger>

      {open && <UpsertProfessionalForm setOpen={setOpen} />}
    </Dialog>
  );
};

export default ProfessionalDetailsButton;
