#!/bin/bash

# Script de configuração para ambiente de desenvolvimento do ProAgendify

echo "🚀 Configurando ambiente de desenvolvimento para o ProAgendify..."

# Instalação das dependências
echo "📦 Instalando dependências..."
npm install

# Configurar arquivos .env
echo "⚙️ Configurando variáveis de ambiente..."

# Backend
if [ ! -f "./backend/.env" ]; then
  echo "Criando arquivo .env para o backend..."
  cp ./backend/.env.example ./backend/.env
  echo "✅ Arquivo .env do backend criado com sucesso!"
else
  echo "⚠️ Arquivo .env do backend já existe."
fi

# Frontend
if [ ! -f "./frontend/.env" ]; then
  echo "Criando arquivo .env para o frontend..."
  cp ./frontend/.env.example ./frontend/.env
  echo "✅ Arquivo .env do frontend criado com sucesso!"
else
  echo "⚠️ Arquivo .env do frontend já existe."
fi

# Iniciar os serviços Docker (PostgreSQL e Redis)
echo "🐳 Iniciando serviços de banco de dados com Docker..."
docker-compose up -d postgres redis

# Esperar o PostgreSQL iniciar
echo "⏳ Aguardando inicialização do PostgreSQL..."
sleep 5

# Executar migrações do Prisma
echo "🔄 Executando migrações do banco de dados..."
cd backend && npx prisma migrate dev --name init

# Voltar para a raiz do projeto
cd ..

echo "🌱 Criando dados iniciais (se aplicável)..."
cd backend && npm run seed

# Gerar client do Prisma
echo "🔧 Gerando cliente Prisma..."
cd backend && npx prisma generate

# Voltar para a raiz do projeto
cd ..

echo "🎉 Ambiente de desenvolvimento configurado com sucesso!"
echo ""
echo "Para iniciar o servidor de desenvolvimento, execute:"
echo "npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3333"
echo "" 