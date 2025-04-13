#!/bin/bash

# Script de configuração para ambiente de desenvolvimento do ProAgendify

echo "🚀 Configurando ambiente de desenvolvimento para o ProAgendify..."

# Instalação das dependências do projeto raiz
echo "📦 Instalando dependências do projeto raiz..."
npm install

# Instalação das dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend && npm install && cd ..

# Instalação das dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend && npm install && cd ..

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

# Verificar se o Docker está em execução
echo "🔍 Verificando se o Docker está em execução..."
if ! docker info > /dev/null 2>&1; then
  echo "❌ O Docker não está em execução ou não está instalado."
  echo "Por favor, inicie o Docker e execute este script novamente."
  exit 1
fi

# Iniciar os serviços Docker (PostgreSQL e Redis)
echo "🐳 Iniciando serviços de banco de dados com Docker..."
docker-compose up -d postgres redis

# Verificar se os contêineres foram iniciados com sucesso
if [ $? -ne 0 ]; then
  echo "❌ Falha ao iniciar os contêineres Docker."
  echo "Verifique se as portas 5432 e 6379 não estão sendo usadas por outros processos."
  exit 1
fi

# Esperar o PostgreSQL iniciar
echo "⏳ Aguardando inicialização do PostgreSQL..."
sleep 5

# Executar migrações do Prisma
echo "🔄 Executando migrações do banco de dados..."
cd backend && npx prisma migrate dev --name init

# Verificar se a migração foi bem-sucedida
if [ $? -ne 0 ]; then
  echo "❌ Falha ao executar as migrações do Prisma."
  echo "Verifique as configurações do banco de dados."
  exit 1
fi

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