# 🧠 PROAGENDIFY

Sistema SaaS para profissionais autônomos da área da beleza/estética. Uma solução completa para gerenciamento de agendamentos, clientes e serviços.

## 🚀 Tecnologias

- **Frontend**:
  - [Next.js](https://nextjs.org/) - Framework React com renderização híbrida
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
  - [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para JavaScript

- **Backend**:
  - [Node.js](https://nodejs.org/) - Runtime JavaScript
  - [Express](https://expressjs.com/) - Framework web para Node.js
  - [Prisma](https://www.prisma.io/) - ORM para TypeScript/JavaScript
  - [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para JavaScript

- **Banco de Dados**:
  - [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
  - [Redis](https://redis.io/) - Cache em memória

- **DevOps**:
  - [Docker](https://www.docker.com/) - Conteinerização
  - [Docker Compose](https://docs.docker.com/compose/) - Orquestração de contêineres
  - [Nginx](https://nginx.org/) - Proxy reverso e servidor web

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (v8 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### Instalação Rápida (Ambiente de Desenvolvimento)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/proagendify.git
cd proagendify

# Execute o script de configuração
chmod +x setup-dev.sh
./setup-dev.sh
```

O script acima realizará automaticamente:
- Instalação de dependências
- Configuração de variáveis de ambiente
- Inicialização dos contêineres Docker para PostgreSQL e Redis
- Execução das migrações do banco de dados
- Geração do cliente Prisma

### Instalação Manual

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/proagendify.git
cd proagendify
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Inicie os contêineres Docker:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
cd backend
npx prisma migrate dev
```

## 🚀 Executando o projeto

### Em ambiente de desenvolvimento

```bash
# Inicia o backend e o frontend simultaneamente
npm run dev

# Ou inicie cada um separadamente
npm run dev:backend
npm run dev:frontend
```

### Em produção

```bash
# Construa o projeto
npm run build

# Inicie o projeto em modo produção
npm run start
```

Ou utilize Docker:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 Estrutura do Projeto

```
proagendify/
├── backend/                # Servidor Node.js/Express
│   ├── prisma/             # Esquema e migrações do Prisma
│   └── src/
│       ├── controllers/    # Controladores da API
│       ├── middlewares/    # Middlewares Express
│       ├── routes/         # Rotas da API
│       └── server.ts       # Ponto de entrada do servidor
├── frontend/               # Aplicação Next.js
│   ├── public/             # Arquivos estáticos
│   └── src/
│       ├── components/     # Componentes React
│       ├── lib/            # Bibliotecas e utilidades
│       ├── pages/          # Páginas e API routes
│       └── styles/         # Estilos globais
├── nginx/                  # Configuração do Nginx
├── docker-compose.yml      # Configuração do Docker Compose (dev)
└── docker-compose.prod.yml # Configuração do Docker Compose (prod)
```

## 📚 Documentação

A documentação detalhada do projeto está disponível nos seguintes arquivos:

- [Documentação Geral](DOCUMENTATION.md)
- [Guia de Testes](GUIA-TESTES.md)
- [Documentação do MCP](MCP-README.md)

## 🔒 Segurança

Este projeto implementa as seguintes medidas de segurança:

- Autenticação por JWT
- Proteção contra CSRF
- Sanitização de entradas
- HTTPS forçado em produção
- Criptografia de senhas com bcrypt

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autores

- Sua Equipe Aqui
