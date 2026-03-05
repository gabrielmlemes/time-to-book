import { DataTable } from '@/components/ui/data-table';

import { getPatients } from '../../_actions/get-patients';
import { columns } from './patients-columns';

export const PatientsTable = async () => {
  const patients = await getPatients();

  return (
    <>
      {patients && patients.length > 0 ? (
        <DataTable columns={columns} data={patients} />
      ) : (
        <p className="text-muted-foreground text-sm">Nenhum paciente cadastrado</p>
      )}
    </>
  );
};
