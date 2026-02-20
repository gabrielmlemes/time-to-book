'use client';
import { ArrowDown } from 'lucide-react';

import { ActionButton } from '@/components/action-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useClinicForm } from '../_hooks/useClinicForm';

export default function ClinicForm() {
  const { form, onSubmit } = useClinicForm();

  return (
    <div className="h-screen w-screen flex justify-center items-center flex-col">
      <h1 className="text-4xl font-semibold text-center">Bem-vindo(a) à plataforma!</h1>
      <h2 className="mt-8 mb-2 flex flex-col items-center text-center text-xl">
        Clique aqui para adicionar uma clínica <ArrowDown />
      </h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Abrir formulário</Button>
        </DialogTrigger>
        <Form {...form}>
          <DialogContent className="sm:max-w-sm">
            <form className="space-y-4">
              <DialogHeader>
                <DialogTitle>Adicionar clínica</DialogTitle>
                <DialogDescription>Digite o nome da sua clínica para continuar</DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da clínica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </DialogClose>

              <ActionButton onSubmitAction={form.handleSubmit(onSubmit)} className="flex-1">
                Criar conta
              </ActionButton>
            </DialogFooter>
          </DialogContent>
        </Form>
      </Dialog>
    </div>
  );
}
