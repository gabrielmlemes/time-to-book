import { DataTable } from '@/components/ui/data-table';

import { getAppointments } from '../../_actions/get-appointments';
import { columns } from './appointments-columns';

export const AppointmentsTable = async () => {
  const appointments = await getAppointments();

  return (
    <>
      {appointments && appointments.length > 0 ? (
        <DataTable columns={columns} data={appointments} />
      ) : (
        <p className="text-muted-foreground text-sm">Nenhum agendamento cadastrado</p>
      )}
    </>
  );
};
