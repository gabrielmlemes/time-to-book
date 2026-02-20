import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { db } from '@/db';
import { usersToClinicsTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import SignOutButton from './_components/sign-out-button';

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  const userClinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });

  if (userClinics.length === 0) {
    redirect('/formulario-da-clinica');
  }

  return (
    <>
      <p>{session?.user?.name}</p>
      <SignOutButton />
    </>
  );
};

export default DashboardPage;
