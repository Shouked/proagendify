# Guia Completo para Testar o ProAgendify Localmente

Este guia fornece instruções detalhadas para configurar e testar o sistema ProAgendify localmente, assumindo diferentes papéis: dono do app, administrador de estabelecimento e cliente final.

## 0. Pré-requisitos

### 0.1. Instalação do Docker

1. Baixe o Docker Desktop para Windows em: https://www.docker.com/products/docker-desktop
2. Execute o instalador e siga as instruções
3. Após a instalação, reinicie seu computador
4. Abra o Docker Desktop e aguarde ele inicializar completamente
5. Verifique se o Docker está funcionando abrindo o PowerShell e executando:
   ```bash
   docker --version
   ```

### 0.2. Configuração do Banco de Dados Neon

O projeto está configurado para usar o Neon (PostgreSQL na nuvem). Para configurar:

1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto
3. Copie a string de conexão fornecida
4. No arquivo `backend/.env`, atualize a variável `DATABASE_URL` com a string de conexão do Neon:
   ```
   DATABASE_URL="sua_string_de_conexao_do_neon"
   ```

## 1. Configuração Inicial do Ambiente

### 1.1. Instalar Dependências

```bash
# Na raiz do projeto
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 1.2. Iniciar os Serviços

#### Opção 1: Usando Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose -f docker-compose.dev.yml up -d
```

Este comando iniciará:
- PostgreSQL (banco de dados)
- Redis (cache)
- Backend (API)
- Frontend (interface do usuário)

#### Opção 2: Iniciando Serviços Separadamente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 1.3. Verificar se os Serviços Estão Rodando

Se usando Docker:
```bash
docker ps
```

Se iniciando separadamente:
- Backend deve estar rodando em http://localhost:3333
- Frontend deve estar rodando em http://localhost:3000

## 2. Configuração do Banco de Dados

### 2.1. Executar as Migrações do Prisma

```bash
cd backend
npm run prisma:migrate
```

Este comando criará as tabelas no banco de dados Neon conforme definido no schema.prisma.

### 2.2. Criar Usuário Superadmin (Dono do App)

#### Opção 1: Via API (Recomendado)

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Principal",
    "email": "admin@proagendify.com",
    "password": "senha123",
    "role": "superadmin",
    "tenantId": "global"
  }'
```

#### Opção 2: Via Prisma Studio

```bash
cd backend
npx prisma studio
```

No Prisma Studio:
1. Acesse http://localhost:5555
2. Vá para a tabela "User"
3. Clique em "Add record"
4. Preencha os campos:
   - name: "Admin Principal"
   - email: "admin@proagendify.com"
   - password: (use bcrypt para hash, ou crie um endpoint para isso)
   - role: "superadmin"
   - tenantId: "global"
5. Clique em "Save 1 record"

## 3. Testando como Dono do App (Superadmin)

### 3.1. Acessar o Sistema

1. Abra http://localhost:3000 no navegador
2. Clique em "Login"
3. Use as credenciais:
   - Email: admin@proagendify.com
   - Senha: senha123

### 3.2. Funcionalidades do Superadmin

Como superadmin, você pode:
1. Gerenciar todos os estabelecimentos (tenants)
2. Ver estatísticas globais do sistema
3. Acessar logs e monitoramento
4. Gerenciar usuários de todos os estabelecimentos

## 4. Testando como Administrador de Estabelecimento

### 4.1. Criar um Estabelecimento (via API)

Primeiro, faça login como superadmin para obter o token JWT:

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@proagendify.com",
    "password": "senha123"
  }'
```

Copie o token JWT da resposta e use-o para criar o estabelecimento:

```bash
curl -X POST http://localhost:3333/api/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Salão de Beleza Exemplo",
    "email": "salao@exemplo.com",
    "phone": "(11) 99999-9999",
    "address": "Rua Exemplo, 123",
    "plan": "basic",
    "status": "active"
  }'
```

A resposta incluirá o ID do tenant criado. Guarde esse ID para os próximos passos.

### 4.2. Criar Usuário Profissional

Use o mesmo token JWT do superadmin para criar o usuário profissional:

```bash
curl -X POST http://localhost:3333/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "name": "Profissional Exemplo",
    "email": "profissional@exemplo.com",
    "password": "senha123",
    "role": "professional",
    "tenantId": "ID_DO_TENANT_CRIADO",
    "phone": "(11) 98888-8888",
    "specialties": ["Cabelo", "Manicure"],
    "status": "active"
  }'
```

### 4.3. Acessar como Profissional

1. Abra http://localhost:3000 no navegador
2. Clique em "Login"
3. Use as credenciais:
   - Email: profissional@exemplo.com
   - Senha: senha123

### 4.4. Funcionalidades do Profissional

Como profissional, você pode:
1. Gerenciar serviços oferecidos
2. Ver e gerenciar agendamentos
3. Gerenciar clientes
4. Ver relatórios de desempenho

## 5. Testando como Cliente Final

### 5.1. Criar Conta de Cliente

#### Opção 1: Via Interface Web

1. Abra http://localhost:3000 no navegador
2. Clique em "Registrar"
3. Preencha o formulário:
   - Nome: "Cliente Exemplo"
   - Email: "cliente@exemplo.com"
   - Senha: "senha123"
   - Confirme a senha: "senha123"
   - Telefone: "(11) 97777-7777"
4. Clique em "Criar conta"

#### Opção 2: Via API

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cliente Exemplo",
    "email": "cliente@exemplo.com",
    "password": "senha123",
    "role": "client",
    "phone": "(11) 97777-7777"
  }'
```

### 5.2. Acessar como Cliente

1. Abra http://localhost:3000 no navegador
2. Clique em "Login"
3. Use as credenciais:
   - Email: cliente@exemplo.com
   - Senha: senha123

### 5.3. Funcionalidades do Cliente

Como cliente, você pode:
1. Ver serviços disponíveis
2. Agendar serviços
3. Ver histórico de agendamentos
4. Gerenciar seu perfil

## 6. Fluxo Completo de Teste

### 6.1. Criar Serviços (como Profissional)

1. Faça login como profissional
2. Vá para a seção "Serviços"
3. Clique em "Adicionar Serviço"
4. Preencha:
   - Nome: "Corte de Cabelo"
   - Preço: 50.00
   - Duração: 30 (minutos)
   - Descrição: "Corte de cabelo profissional"
5. Clique em "Salvar"

### 6.2. Agendar Serviço (como Cliente)

1. Faça login como cliente
2. Vá para a seção "Agendar"
3. Selecione o serviço "Corte de Cabelo"
4. Escolha uma data e hora disponível
5. Clique em "Confirmar Agendamento"

### 6.3. Gerenciar Agendamento (como Profissional)

1. Faça login como profissional
2. Vá para a seção "Agendamentos"
3. Verifique o novo agendamento
4. Você pode:
   - Confirmar o agendamento
   - Marcar como concluído
   - Cancelar o agendamento

## 7. Testando em Diferentes Dispositivos

Para testar a responsividade:
1. Use as ferramentas de desenvolvedor do navegador (F12)
2. Alternar para o modo de visualização móvel
3. Teste em diferentes tamanhos de tela

## 8. Encerrando os Testes

### 8.1. Parar os Serviços

Se usando Docker:
```bash
# Na raiz do projeto
docker-compose -f docker-compose.dev.yml down
```

Se iniciando separadamente:
- Pressione Ctrl+C em cada terminal onde os serviços estão rodando

### 8.2. Limpar Dados (Opcional)

Se quiser limpar todos os dados e começar do zero:

```bash
# Se usando Docker
docker-compose -f docker-compose.dev.yml down -v

# Recriar containers
docker-compose -f docker-compose.dev.yml up -d

# Executar migrações novamente
cd backend
npm run prisma:migrate
```

## Observações Importantes

1. **Banco de Dados**: O sistema está configurado para usar o Neon (PostgreSQL na nuvem). Certifique-se de que a string de conexão está correta no arquivo .env.

2. **Autenticação**: O sistema usa JWT para autenticação. Os tokens são armazenados no localStorage do navegador.

3. **Multi-tenant**: O sistema é multi-tenant, o que significa que cada estabelecimento tem seus próprios dados isolados.

4. **Cache**: O Redis é usado para cache. Isso melhora o desempenho do sistema.

5. **Ambiente de Desenvolvimento**: Este guia assume que você está em um ambiente de desenvolvimento. Para produção, use os arquivos docker-compose.prod.yml.

## Solução de Problemas Comuns

### Erro 404 ao acessar o frontend

Se você encontrar um erro 404 ao acessar o frontend, verifique:

1. Se o servidor Next.js está rodando corretamente
2. Se as páginas básicas (index.tsx, _app.tsx, _document.tsx) existem
3. Se há erros de compilação no console

### Problemas de conexão com o banco de dados

Se houver problemas de conexão com o banco de dados:

1. Verifique se a string de conexão do Neon está correta no arquivo .env
2. Verifique se o banco Neon está online
3. Tente executar as migrações novamente: `cd backend && npm run prisma:migrate`

### Problemas de autenticação

Se houver problemas de autenticação:

1. Verifique se o JWT_SECRET está configurado corretamente
2. Limpe o localStorage do navegador e tente novamente
3. Verifique se o usuário existe no banco de dados

---

Desenvolvido como parte do projeto ProAgendify, um SaaS multi-tenant para profissionais da área de beleza/estética.
