'use client';

import { ptBR } from 'date-fns/locale';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Doctor } from '../../medicos/_types/doctor';
import { Patient } from '../../pacientes/_types/patient';
import { useUpsertAppointment } from '../_hooks/useUpsertAppointment';
import { Appointment } from '../_types/appointment';

interface UpsertAppointmentFormProps {
  setOpen: (open: boolean) => void;
  appointment?: Appointment;
  patients: Patient[];
  doctors: Doctor[];
}

export const UpsertAppointmentForm = ({
  setOpen,
  appointment,
  patients,
  doctors,
}: UpsertAppointmentFormProps) => {
  const { form, onSubmit } = useUpsertAppointment({
    closeModal: () => setOpen(false),
    appointment,
  });

  const selectedDoctorId = form.watch('doctorId');
  const selectedPatientId = form.watch('patientId');
  // const date = form.watch('date');

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
                        {doctor.name}
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
                <Popover>
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
                      onSelect={field.onChange}
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
                  disabled={!isPatientAndDoctorSelected}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* TODO: Implementar horários disponíveis baseados nos horários disponíveis do profissional */}
                    <SelectGroup>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                    </SelectGroup>
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
