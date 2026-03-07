'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

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

const ActionsCell = ({ patient }: { patient: Patient }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const patientName = patient.name;

  const handleCloseAll = () => {
    setIsDeleteDialogOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVerticalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-center">{patientName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild>
            <EditPatientTableButton patient={patient} onClick={() => setIsDropdownOpen(false)} />
          </DropdownMenuItem>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 w-full text-center">
                <TrashIcon className="mr-2 size-4" />
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
                  Esta ação não pode ser desfeita. Isso irá deletar todos os dados e agendamentos de{' '}
                  <strong className="text-foreground">{patientName}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel className="flex-1">Cancelar</AlertDialogCancel>

                <AlertDialogAction asChild>
                  <DeletePatientButton patient={patient} onSuccess={handleCloseAll} />
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Patient>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
      return <span className="font-medium text-foreground">{row.original.name}</span>;
    },
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
    cell: ({ row }) => <ActionsCell patient={row.original} />,
  },
];
