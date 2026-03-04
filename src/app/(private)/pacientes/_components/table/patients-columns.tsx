'use client';

import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVerticalIcon, TrashIcon } from 'lucide-react';

import { PatientsDetailsButton } from '@/app/(private)/pacientes/_components/table/patients-details-button';
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
import { patientsTable } from '@/db/schema';

import type { PatientSex } from '../../_constants/patient';
import { getPatientSexLabel } from '../../_constants/patient';

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
          <DropdownMenuContent>
            <DropdownMenuGroup className="space-y-2">
              <DropdownMenuLabel>{patientName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <PatientsDetailsButton patient={patient.original} />
              </DropdownMenuItem>
              <Button variant="destructive" className="w-full">
                <TrashIcon className="w-4 h-4 text-white" />
                Excluir
              </Button>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
