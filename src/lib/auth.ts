import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { customSession } from 'better-auth/plugins';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

import { db } from '@/db';
import * as schema from '@/db/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userClinics = await db.query.usersToClinicsTable.findMany({
        where: eq(schema.usersToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      });
      // TODO: Ao adaptar para o usuário ter múltiplas clínicas, deve-se alterar esse trecho do código. Por enquanto só está retornado a primeira clínica.
      const firstClinic = userClinics?.[0];

      return {
        ...session,
        user: {
          ...user,
          clinic: {
            id: firstClinic?.clinicId,
            name: firstClinic?.clinic?.name,
          },
        },
      };
    }),
  ],
  user: {
    modelName: 'usersTable',
  },
  session: {
    modelName: 'sessionsTable',
  },
  account: {
    modelName: 'accountsTable',
  },
  verification: {
    modelName: 'verificationsTable',
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Time to Book <contato@timetobook.com>',
        to: user.email,
        subject: 'Verifique seu e-mail',
        html: `<p>Olá ${user.name},</p><p>Clique no link abaixo para verificar seu e-mail e acessar a plataforma Time to Book:</p><a href="${url}">Verificar e-mail</a>`,
      });
    },
  },
});
