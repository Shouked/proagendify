import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

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
          // Log para depuração
          console.log(`Fazendo login na API: ${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
          
          // Garantir que a URL está correta, adicionando /api se necessário
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const loginUrl = `${apiUrl}/api/auth/login`;
          
          console.log(`URL de login final: ${loginUrl}`);
          
          const response = await axios.post(loginUrl, {
            email: credentials.email,
            password: credentials.password,
          });

          // Log para depuraçãotestar 
          console.log('Resposta da API:', JSON.stringify(response.data, null, 2));

          if (response.data && response.data.user) {
            return {
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
              tenantId: response.data.user.tenantId,
              token: response.data.token,
            };
          }
          return null;
        } catch (error: any) {
          console.error('Auth error:', error);
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Adiciona valores do usuário ao token
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.accessToken = user.token;
        
        // Log para depuração
        console.log('Token JWT gerado:', JSON.stringify(token, null, 2));
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Adiciona valores do token à sessão
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.accessToken = token.accessToken as string;
        
        // Log para depuração
        console.log('Sessão gerada:', JSON.stringify(session, null, 2));
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
