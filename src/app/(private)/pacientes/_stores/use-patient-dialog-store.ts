import { create } from 'zustand';

export type PatientDialogState = {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
};

export const usePatientDialogStore = create<PatientDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
