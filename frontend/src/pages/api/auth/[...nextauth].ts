import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// LOG DE DIAGNÓSTICO NO TOPO
console.log('[NextAuth Init] Tentando inicializar...');
console.log('[NextAuth Init] NEXTAUTH_SECRET presente?', !!process.env.NEXTAUTH_SECRET);
console.log('[NextAuth Init] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('[NextAuth Init] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

if (!process.env.NEXTAUTH_SECRET) {
  console.error('[NextAuth Init] ERRO FATAL: NEXTAUTH_SECRET não definido!');
}
if (!process.env.NEXTAUTH_URL) {
  console.warn('[NextAuth Init] AVISO: NEXTAUTH_URL não definido!'); // Não é fatal, mas importante
}

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
          
          // Garantir que a URL está correta, evitando barras duplas
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
          // Remove a barra no final, se existir
          const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
          const loginUrl = `${baseUrl}/api/auth/login`;
          
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
    async jwt({ token, user, account }) {
      // Log inicial do token e user
      console.log('[JWT Callback] Iniciando. Token recebido:', JSON.stringify(token, null, 2));
      console.log('[JWT Callback] User recebido:', JSON.stringify(user, null, 2));
      console.log('[JWT Callback] Account recebido:', JSON.stringify(account, null, 2));

      // Na primeira vez (login), o objeto `user` está presente.
      if (account && user) {
        console.log('[JWT Callback] Login inicial detectado.');
        // Retorna um novo objeto token com os dados necessários
        return {
          ...token, // Mantém propriedades existentes do token (como iat, exp)
          id: user.id,
          role: user.role,
          tenantId: user.tenantId,
          accessToken: user.token, // <- Pega o token do backend
          accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // Exemplo: 1 dia
        };
      }

      // Para requisições subsequentes, o `token` já existe.
      // Podemos adicionar lógica de refresh token aqui se necessário.
      console.log('[JWT Callback] Requisição subsequente. Token atual:', JSON.stringify(token, null, 2));
      
      // Retorna o token existente (ou atualizado, se houvesse refresh)
      return token;
    },
    async session({ session, token }) {
      // Log inicial da sessão e token
      console.log('[Session Callback] Iniciando. Sessão recebida:', JSON.stringify(session, null, 2));
      console.log('[Session Callback] Token recebido (do callback jwt):', JSON.stringify(token, null, 2));

      // Transfere dados do `token` (gerado pelo callback jwt) para o objeto `session`.
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.accessToken = token.accessToken as string;
        
        console.log('[Session Callback] Sessão final a ser retornada:', JSON.stringify(session, null, 2));
      } else {
         console.error('[Session Callback] ERRO: Token não recebido do callback JWT!');
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
