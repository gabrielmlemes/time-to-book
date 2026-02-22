'use client';

import { ActionButton } from '@/components/action-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { GoogleIcon } from '@/components/ui/google-icon';
import { Input } from '@/components/ui/input';

import { useSignInForm } from '../_hooks/authentication-hooks';

export function SignInForm() {
  const { form, onSubmit, resendVerificationEmail, signInWithGoogle } = useSignInForm();

  return (
    <Card>
      <Form {...form}>
        <CardHeader>
          <CardTitle className="text-center">Entrar</CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Crie sua senha (mínimo 8 caracteres)"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </CardContent>

        <CardFooter>
          <ActionButton onSubmitAction={form.handleSubmit(onSubmit)}>Entrar</ActionButton>
        </CardFooter>
      </Form>

      <div className="flex justify-center flex-col items-center gap-3 px-6">
        <Button variant="outline" className="text-xs w-full" onClick={signInWithGoogle}>
          <GoogleIcon />
          Entrar com Google
        </Button>

        <Button variant="link" onClick={resendVerificationEmail} className="text-xs">
          Reenviar e-mail de verificação
        </Button>
      </div>
    </Card>
  );
}
