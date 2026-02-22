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
        callbackURL: '/dashboard',
      },
      {
        onSuccess: () => {
          toast.success(
            `Conta criada! \n
            Verifique seu e-mail e ative sua conta.`
          );
          form.reset();
        },
        onError: (ctx) => {
          console.log(ctx);

          if (ctx.error.status === 422) {
            toast.error('Dados inválidos. Verifique as informações fornecidas.');
            return;
          }

          toast.error(ctx.error.message || 'Erro ao criar conta');
        },
      }
    );
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
        onError: (ctx) => {
          if (ctx.error.code === 'EMAIL_NOT_VERIFIED') {
            toast.error('E-mail não verificado. Por favor, verifique sua caixa de entrada.');
            return;
          }

          toast.error('Erro ao acessar a conta. Verifique suas credenciais!');
          form.reset();
        },
      }
    );
  }

  async function resendVerificationEmail() {
    const email = form.getValues('email');
    if (!email) {
      toast.error('Digite seu e-mail para reenviar o link de verificação.');
      return;
    }

    await authClient.sendVerificationEmail(
      {
        email,
        callbackURL: '/dashboard',
      },
      {
        onSuccess: () => {
          toast.success('E-mail de verificação reenviado com sucesso!');
        },
        onError: () => {
          toast.error('Erro ao reenviar e-mail.');
        },
      }
    );
  }

  return {
    form,
    onSubmit,
    resendVerificationEmail,
  };
}
