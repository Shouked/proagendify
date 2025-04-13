#!/usr/bin/env bash
# Script de construção para o Render

echo "Iniciando script de build para Render..."

# Garantir que o Node.js esteja utilizando a versão correta
export NODE_OPTIONS="--max_old_space_size=2048"

# Limpar qualquer build anterior
rm -rf dist
rm -rf node_modules/.prisma/client

# Instalar dependências (caso ainda não tenha sido feito)
echo "Instalando dependências..."
npm install

# Gerar o Prisma Client
echo "Gerando Prisma Client..."
SKIP_PRISMA_CONNECT=true npx prisma generate

# Verificar se o Prisma Client foi gerado corretamente
if [ ! -f "node_modules/.prisma/client/index.js" ]; then
  echo "ERRO: Prisma Client não foi gerado corretamente!"
  exit 1
fi

echo "Verificando binário do Prisma..."
ls -la node_modules/.prisma/client/

# Executar migrações do banco de dados em produção
if [ "$NODE_ENV" = "production" ]; then
  echo "Executando migrações do banco de dados..."
  npx prisma migrate deploy
  echo "Migrações concluídas com sucesso!"
else
  echo "Ambiente não é produção. Pulando migrações do banco de dados."
fi

# Compilar TypeScript
echo "Compilando TypeScript..."
npx tsc --project tsconfig-render.json

# Criar diretório de destino para o Prisma e copiar binário
echo "Copiando binário do Prisma..."
mkdir -p dist/prisma
cp node_modules/.prisma/client/query-engine-linux-musl-openssl-3.0.x dist/prisma/
chmod +x dist/prisma/query-engine-linux-musl-openssl-3.0.x

# Copiar schema.prisma para o diretório de distribuição
echo "Copiando schema.prisma..."
cp prisma/schema.prisma dist/prisma/

echo "Verificando arquivos copiados:"
ls -la dist/prisma/

echo "Build concluído com sucesso!"
exit 0 