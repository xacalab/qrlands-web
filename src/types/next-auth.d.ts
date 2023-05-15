// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name: string;
      image: string;
    };
    apiToken: string;
  }

  interface User {
    email: string;
    name: string;
    image: string;
    apiToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    name: string;
    email: string;
    picture: string;
    sub: string;
    iat: number;
    exp: number;
    jti: string;
    apiToken: string;
  }
}
