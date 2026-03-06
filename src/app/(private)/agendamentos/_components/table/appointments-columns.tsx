'use client';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { EllipsisVerticalIcon, TrashIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { formatCurrencyInCents } from '@/helpers/format-currency';

import { getAppointments } from '../../_actions/get-appointments';
import { DeleteAppointmentButton } from './delete-appointment-button';
import { EditAppointmentTableButton } from './edit-appointment-table-button';

// Tipo para os dados da tabela incluindo as relações através da inferência da action
type AppointmentWithRelations = Awaited<ReturnType<typeof getAppointments>>[number];

export const columns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: 'patient',
    accessorKey: 'patient.name',
    header: 'Paciente',
  },
  {
    id: 'doctor',
    accessorKey: 'doctor.name',
    header: 'Profissional',
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      return dayjs(row.original.date).format('DD/MM/YYYY [às] HH:mm');
    },
  },
  {
    id: 'price',
    accessorKey: 'appointmentPriceInCents',
    header: 'Valor',
    cell: ({ row }) => {
      return formatCurrencyInCents(row.original.appointmentPriceInCents);
    },
  },
  {
    id: 'actions',
    cell: ({ row: appointment }) => {
      const patientName = appointment.original.patient.name;
      const doctorName = appointment.original.doctor.name;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Agendamento: {patientName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem asChild>
                <EditAppointmentTableButton appointment={appointment.original} />
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex-1 w-full justify-start px-2 py-1.5 text-sm font-normal h-auto"
                  >
                    <TrashIcon className="mr-2 size-4 text-white" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl w-full">
                      Deseja realmente deletar este agendamento?
                    </AlertDialogTitle>
                    <Separator />

                    <AlertDialogDescription className="w-full text-center">
                      Esta ação não pode ser desfeita. Isso irá deletar permanentemente o
                      agendamento de <strong className="text-foreground">{patientName}</strong> com
                      o profissional <strong className="text-foreground">{doctorName}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex">
                    <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <DeleteAppointmentButton appointment={appointment.original} />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
