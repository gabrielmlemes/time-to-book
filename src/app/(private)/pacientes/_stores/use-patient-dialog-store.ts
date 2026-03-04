import { create } from 'zustand';

import type { Patient } from '../_types/patient';

export type PatientDialogState = {
  isOpen: boolean;
  patient?: Patient;
  openDialog: (patient?: Patient) => void;
  closeDialog: () => void;
};

export const usePatientDialogStore = create<PatientDialogState>((set) => ({
  isOpen: false,
  patient: undefined,
  openDialog: (patient) => set({ isOpen: true, patient: patient }),
  closeDialog: () => set({ isOpen: false, patient: undefined }),
}));
