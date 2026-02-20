import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { auth } from '@/lib/auth';

import { SignInForm } from './_components/sign-in-form';
import { SignUpForm } from './_components/sign-up-form';

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="w-full">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Criar conta</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <SignInForm />
        </TabsContent>

        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
