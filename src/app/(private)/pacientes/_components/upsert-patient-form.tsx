'use client';

import { ActionButton } from '@/components/action-button';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPhoneNumber } from '@/helpers/format-phone';

import { useUpsertPatient } from '../_hooks/useUpsertPatient';
import { Patient } from '../_types/patient';

interface UpsertPatientFormProps {
  setOpen: (open: boolean) => void;
  patient?: Patient;
}

export const UpsertPatientForm = ({ setOpen, patient }: UpsertPatientFormProps) => {
  const { form, onSubmit } = useUpsertPatient({
    closeModal: () => setOpen(false),
    patient,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{patient ? 'Editar paciente' : 'Cadastrar paciente'}</DialogTitle>
        <DialogDescription>
          {patient ? 'Edite os dados do paciente.' : 'Cadastre os dados do paciente.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do paciente</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o e-mail do paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="tel"
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                    onChange={(event) => {
                      const formatted = formatPhoneNumber(event.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="sex"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="flex">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancelar
              </Button>
            </DialogClose>

            <ActionButton onSubmitAction={form.handleSubmit(onSubmit)} className="flex-1">
              {patient ? 'Atualizar' : 'Cadastrar'}
            </ActionButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
