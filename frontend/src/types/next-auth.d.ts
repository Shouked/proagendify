import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      tenantId: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    tenantId: string;
    accessToken: string;
  }
} 