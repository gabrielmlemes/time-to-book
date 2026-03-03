import { create } from 'zustand';

import { Doctor } from '@/app/(private)/medicos/_types/doctor';

type ProfessionalDialogState = {
  isOpen: boolean;
  doctor?: Doctor;
  openDialog: (doctor?: Doctor) => void;
  closeDialog: () => void;
};

export const useProfessionalDialogStore = create<ProfessionalDialogState>((set) => ({
  isOpen: false,
  doctor: undefined,
  openDialog: (doctor) => set({ isOpen: true, doctor: doctor }),
  closeDialog: () => set({ isOpen: false, doctor: undefined }),
}));
