'use client';

import dynamic from 'next/dynamic';

import { Dialog } from '@/components/ui/dialog';

import { useProfessionalDialogStore } from '../_stores/use-professional-dialog-store';

const UpsertProfessionalForm = dynamic(
  () => import('./upsert-professional-form').then((mod) => mod.UpsertProfessionalForm),
  {
    ssr: false,
  }
);

export function ProfessionalDialog() {
  const { isOpen, closeDialog, doctor } = useProfessionalDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {isOpen && <UpsertProfessionalForm setOpen={closeDialog} doctor={doctor} />}
    </Dialog>
  );
}
