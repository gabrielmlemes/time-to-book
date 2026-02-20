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
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          // callbackURL: '/login',
        },
        {
          onSuccess: () => {
            router.push('/dashboard');
          },
        }
      );

      form.reset();
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      console.log(error);
      toast.error('Erro ao criar conta');
    }
  }

  return {
    form,
    onSubmit,
  };
}

export function useSignInForm() {
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: SignInSchema) {
    console.log(data);
  }

  return {
    form,
    onSubmit,
  };
}
