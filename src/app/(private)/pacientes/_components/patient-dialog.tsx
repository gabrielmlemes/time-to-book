'use client';

import dynamic from 'next/dynamic';

import { Dialog } from '@/components/ui/dialog';

import { usePatientDialogStore } from '../_stores/use-patient-dialog-store';

const UpsertPatientForm = dynamic(
  () => import('./upsert-patient-form').then((mod) => mod.UpsertPatientForm),
  {
    ssr: false,
  }
);

export function PatientsDialog() {
  const { isOpen, closeDialog } = usePatientDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {isOpen && <UpsertPatientForm setOpen={closeDialog} />}
    </Dialog>
  );
}
