import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// LOG DE DIAGNÓSTICO SIMPLIFICADO
console.log('NEXTAUTH: INICIALIZANDO');

// Configuração simplificada ao máximo
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('NEXTAUTH: TENTANDO LOGIN');
          
          // URL simplificada
          const loginUrl = 'https://proagendify.onrender.com/api/auth/login';
          
          console.log('NEXTAUTH: URL LOGIN =', loginUrl);
          
          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password,
          });

          console.log('NEXTAUTH: RESPOSTA LOGIN RECEBIDA');

          if (response.data && response.data.user) {
            console.log('NEXTAUTH: USUÁRIO AUTENTICADO');
            return {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
              tenantId: response.data.user.tenantId,
              token: response.data.token,
            };
          }
          
          console.log('NEXTAUTH: LOGIN FALHOU - DADOS INVÁLIDOS');
          return null;
        } catch (error: any) {
          console.log('NEXTAUTH: ERRO NO LOGIN', error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('NEXTAUTH: CALLBACK JWT');
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('NEXTAUTH: CALLBACK SESSION');
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET || 'sua-chave-secreta-forte-aqui-apenas-dev',
});
