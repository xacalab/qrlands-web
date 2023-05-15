import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import NextAuth, { CallbacksOptions, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Provider } from 'next-auth/providers';

import { apiFetch } from '@web/lib/typed-fetch';

interface AuthSignInResponse {
  jwt: string;
  id: string;
  name: string;
  image: string;
  email: string;
}

const providers = (() => {
  const px: Provider[] = [
    CredentialsProvider({
      name: 'Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'john.doe@some-service.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials) {
          const { email, password } = credentials;
          const {
            data: { jwt, ...data },
          } = await apiFetch<AuthSignInResponse>(`/auth/sign-in/password`, {
            method: 'POST',
            body: {
              provider: 'password',
              email,
              password,
            },
          });

          if (jwt) {
            return { ...data, apiToken: jwt };
          }
        }

        return null;
      },
    }),
  ];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    px.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            scope: [
              'openid',
              'https://www.googleapis.com/auth/calendar',
              'https://www.googleapis.com/auth/userinfo.email',
              'https://www.googleapis.com/auth/userinfo.profile',
            ].join(' '),
          },
        },
      }),
    );
  }

  return px;
})();

export const authOptions: NextAuthOptions & {
  callbacks: Partial<CallbacksOptions<GoogleProfile>>;
} = {
  providers,
  session: { strategy: 'jwt' },
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        apiToken: token.apiToken as string,
      };
    },
    jwt: async ({ account, profile, token, user }) => {
      // Initial sign in
      if (
        account?.provider === 'google' &&
        user &&
        profile &&
        'given_name' in profile
      ) {
        const { data } = await apiFetch<AuthSignInResponse>(
          `/auth/sign-in/google`,
          {
            method: 'POST',
            body: {
              locale: profile.locale,
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
              fullName: profile.name,
              image: profile.picture,
              accessToken: account.access_token,
              idToken: account.id_token,
            },
          },
        );

        return { ...token, apiToken: data.jwt };
      }

      if (user?.apiToken) {
        token.apiToken = user.apiToken;
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);
