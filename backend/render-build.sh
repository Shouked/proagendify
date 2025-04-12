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

# Criar diretórios necessários para o Prisma
echo "Configurando diretórios do Prisma..."
mkdir -p dist/node_modules/.prisma
mkdir -p dist/node_modules/@prisma

# Copiar arquivos necessários do Prisma
echo "Copiando arquivos do Prisma..."
cp -R node_modules/.prisma dist/node_modules/
cp -R node_modules/@prisma dist/node_modules/
cp -R prisma dist/

echo "Build concluído com sucesso!"
exit 0 