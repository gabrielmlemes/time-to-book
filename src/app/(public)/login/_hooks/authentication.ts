import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

  function onSubmit(data: SignupSchema) {
    console.log(data);
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
