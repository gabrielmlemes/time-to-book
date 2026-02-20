'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { ActionButton } from '@/components/action-button';
import { authClient } from '@/lib/auth-client';

const SignOutButton = () => {
  const router = useRouter();
  async function signOut() {
    try {
      await authClient.signOut();
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ActionButton onSubmitAction={signOut} textChildren="Saindo">
      Sair da sessão
    </ActionButton>
  );
};

export default SignOutButton;
