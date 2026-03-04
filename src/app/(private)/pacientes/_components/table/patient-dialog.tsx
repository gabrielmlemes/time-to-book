'use client';

import dynamic from 'next/dynamic';

import { Dialog } from '@/components/ui/dialog';

import { usePatientDialogStore } from '../../_stores/use-patient-dialog-store';

const UpsertPatientForm = dynamic(
  () => import('../upsert-patient-form').then((mod) => mod.UpsertPatientForm),
  {
    ssr: false,
  }
);

export function PatientDialog() {
  const { isOpen, closeDialog, patient } = usePatientDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      {isOpen && <UpsertPatientForm setOpen={closeDialog} patient={patient} />}
    </Dialog>
  );
}
