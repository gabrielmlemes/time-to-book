import React from 'react';

import { AddPatientButton } from './add-patient-button';

const PatientsPageHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
        <p className="text-sm text-muted-foreground">Gerencie os pacientes da sua clínica.</p>
      </div>
      <AddPatientButton />
    </div>
  );
};

export { PatientsPageHeader };
