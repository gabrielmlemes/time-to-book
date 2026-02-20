'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

import {
  SignInSchema,
  signInSchema,
  SignupSchema,
  signupSchema,
} from '../_schemas/authentication-schema';

export function useSignupForm() {
  const router = useRouter();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignupSchema) {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        // callbackURL: '/login', // apenas se for adicionar verificação de email
      },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: (ctx) => {
          if (ctx.error.message == 'User already exists') {
            toast.error('E-mail já cadastrado');
            return;
          }
        },
      }
    );

    form.reset();
  }

  return {
    form,
    onSubmit,
  };
}

// -------------------------------------------------------

export function useSignInForm() {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignInSchema) {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push('/dashboard');
        },
        onError: () => {
          toast.error('Erro ao acessar a conta. Verifique suas credenciais!');
          form.reset();
        },
      }
    );
  }

  return {
    form,
    onSubmit,
  };
}
