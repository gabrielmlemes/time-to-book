import { create } from 'zustand';

import { Appointment } from '@/app/(private)/agendamentos/_types/appointment';

type AppointmentDialogState = {
  isOpen: boolean;
  appointment?: Appointment;
  openDialog: (appointment?: Appointment) => void;
  closeDialog: () => void;
};

export const useAppointmentDialogStore = create<AppointmentDialogState>((set) => ({
  isOpen: false,
  appointment: undefined,
  openDialog: (appointment) => set({ isOpen: true, appointment: appointment }),
  closeDialog: () => set({ isOpen: false, appointment: undefined }),
}));
