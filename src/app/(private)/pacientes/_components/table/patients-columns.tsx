'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, TrashIcon } from 'lucide-react';

import { EditPatientTableButton } from '@/app/(private)/pacientes/_components/table/edit-patient-table-button';
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
import { patientsTable } from '@/db/schema';

import type { PatientSex } from '../../_constants/patient';
import { getPatientSexLabel } from '../../_constants/patient';
import { DeletePatientButton } from './delete-patient-button';

type Patient = typeof patientsTable.$inferSelect;

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: 'Telefone',
  },
  {
    id: 'sex',
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => {
      const value = row.getValue('sex') as PatientSex;

      return getPatientSexLabel(value);
    },
  },
  {
    id: 'actions',
    cell: ({ row: patient }) => {
      const patientName = patient.original.name;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{patientName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
              <DropdownMenuItem asChild>
                <EditPatientTableButton patient={patient.original} />
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1 w-full">
                    <TrashIcon className="size-4 text-white" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl w-full">
                      Deseja realmente deletar este paciente?
                    </AlertDialogTitle>
                    <Separator />

                    <AlertDialogDescription className="w-full text-center">
                      <p>
                        Esta ação não pode ser desfeita. Isso irá deletar todos os dados e consultas
                        de <strong className="text-foreground">{patientName}</strong>.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="flex">
                    <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>

                    <AlertDialogAction asChild>
                      <DeletePatientButton patient={patient.original} />
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
