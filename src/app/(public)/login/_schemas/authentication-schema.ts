import z from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'O nome é obrigatório' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
  email: z.email({ message: 'Insira um email válido' }).trim(),
  password: z.string().trim().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
  // confirmPassword: z.string().min(8, { message: 'As senhas devem ser iguais' }),
});
export type SignupSchema = z.infer<typeof signupSchema>;

export const signInSchema = z.object({
  email: z.email({ message: 'Insira um email válido' }).trim(),
  password: z.string().trim().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
});
export type SignInSchema = z.infer<typeof signInSchema>;
