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
npx prisma generate

# Compilar TypeScript
echo "Compilando TypeScript..."
npx tsc --project tsconfig-render.json

# Criar diretório de destino para o Prisma e copiar binário
echo "Copiando binário do Prisma..."
mkdir -p dist/prisma
cp node_modules/.prisma/client/query-engine-linux-musl-openssl-3.0.x dist/prisma/
chmod +x dist/prisma/query-engine-linux-musl-openssl-3.0.x

echo "Verificando binário copiado:"
ls -la dist/prisma/

echo "Build concluído com sucesso!"
exit 0 