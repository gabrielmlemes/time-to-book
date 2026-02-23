import { customSessionClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { auth } from './auth';
export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});

export const signIn = async () => {
  await authClient.signIn.social({
    provider: 'google',
  });
};
