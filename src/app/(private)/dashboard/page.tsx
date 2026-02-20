import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

import { auth } from '@/lib/auth';

import SignOutButton from './_components/sign-out-button';

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <>
      <p>{session?.user?.name}</p>
      <SignOutButton />
    </>
  );
};

export default DashboardPage;
