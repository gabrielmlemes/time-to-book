'use client';

import { ptBR } from 'date-fns/locale';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { ActionButton } from '@/components/action-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Doctor } from '../../medicos/_types/doctor';
import { Patient } from '../../pacientes/_types/patient';
import { getAvailabilitySlots } from '../_helpers/availability-slots';
import { useUpsertAppointment } from '../_hooks/useUpsertAppointment';
import { Appointment } from '../_types/appointment';

interface UpsertAppointmentFormProps {
  setOpen: (open: boolean) => void;
  appointment?: Appointment;
  patients: Patient[];
  doctors: Doctor[];
  existingAppointments: { id: string; date: Date; doctorId: string }[];
}

export const UpsertAppointmentForm = ({
  setOpen,
  appointment,
  patients,
  doctors,
  existingAppointments,
}: UpsertAppointmentFormProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { form, onSubmit } = useUpsertAppointment({
    closeModal: () => setOpen(false),
    appointment,
  });

  const selectedDoctorId = form.watch('doctorId');
  const selectedPatientId = form.watch('patientId');
  const date = form.watch('date');

  const availableSlots = useMemo(() => {
    if (!selectedDoctorId || !date) return [];

    const doctor = doctors.find((d) => d.id === selectedDoctorId);
    if (!doctor) return [];

    return getAvailabilitySlots({
      date,
      doctorId: selectedDoctorId,
      currentAppointmentId: appointment?.id,
      existingAppointments,
      doctor: {
        availableFromTime: doctor.availableFromTime,
        availableToTime: doctor.availableToTime,
        availableFromWeekday: doctor.availableFromWeekday,
        availableToWeekday: doctor.availableToWeekday,
      },
    });
  }, [selectedDoctorId, date, doctors, existingAppointments, appointment?.id]);

  // Lógica para identificar estados de disponibilidade
  const isDateAndDoctorSelected = !!selectedDoctorId && !!date;

  const doctorWorksToday = useMemo(() => {
    if (!selectedDoctorId || !date) return false;
    const doctor = doctors.find((d) => d.id === selectedDoctorId);
    if (!doctor) return false;
    const selectedDay = dayjs(date).day();
    return selectedDay >= doctor.availableFromWeekday && selectedDay <= doctor.availableToWeekday;
  }, [selectedDoctorId, date, doctors]);

  // Extraímos isFull e allPast para o placeholder
  const { isFull, allPast } = useMemo(() => {
    if (!doctorWorksToday || availableSlots.length === 0) {
      return { isFull: false, allPast: false };
    }

    // Filtramos apenas os slots que estariam dentro do horário do médico
    const workableSlots = availableSlots.filter((s) => s.isWithinHours);
    const anyAvailable = workableSlots.some((s) => s.available);
    const everyPast = workableSlots.every((s) => s.isPast);

    return {
      isFull: !anyAvailable,
      allPast: everyPast,
    };
  }, [doctorWorksToday, availableSlots]);

  const isDoctorSelected = !!selectedDoctorId;
  const isPatientAndDoctorSelected = !!selectedDoctorId && !!selectedPatientId;

  useEffect(() => {
    if (selectedDoctorId && !appointment) {
      const doctor = doctors.find((d) => d.id === selectedDoctorId);
      if (doctor) {
        form.setValue('appointmentPriceInCents', doctor.appointmentPriceInCents / 100);
      }
    }
  }, [selectedDoctorId, doctors, form, appointment]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{appointment ? 'Editar agendamento' : 'Novo agendamento'}</DialogTitle>
        <DialogDescription>
          {appointment
            ? 'Atualize os dados do agendamento abaixo.'
            : 'Preencha os dados para criar um novo agendamento.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="patientId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="doctorId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}{' '}
                        <span className="text-muted-foreground text-xs">({doctor.specialty})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="appointmentPriceInCents"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da consulta</FormLabel>
                <NumericFormat
                  disabled={!isDoctorSelected}
                  value={field.value === 0 ? '' : field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue ?? 0);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$ "
                  placeholder="R$ 0,00"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do agendamento</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!isPatientAndDoctorSelected}
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format('DD/MM/YYYY')
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      autoFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="time"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <Select
                  disabled={!isDateAndDoctorSelected}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !isDateAndDoctorSelected
                            ? 'Aguardando profissional e data'
                            : !doctorWorksToday
                              ? 'Médico não atende neste dia'
                              : allPast
                                ? 'Horários já passaram para hoje'
                                : isFull
                                  ? 'Agenda lotada para este dia'
                                  : 'Selecione um horário'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.time} value={slot.time} disabled={!slot.available}>
                        {slot.time}{' '}
                        {!slot.available &&
                          (slot.isOccupied
                            ? '(Ocupado)'
                            : slot.isPast
                              ? '(Horário já passou)'
                              : !slot.isWithinWorkdays
                                ? '(Médico não atende neste dia)'
                                : !slot.isWithinHours
                                  ? '(Fora do horário de atendimento)'
                                  : '')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancelar
              </Button>
            </DialogClose>
            <ActionButton onSubmitAction={form.handleSubmit(onSubmit)} className="flex-1">
              {appointment ? 'Salvar alterações' : 'Criar agendamento'}
            </ActionButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
