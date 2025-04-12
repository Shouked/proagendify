#!/usr/bin/env bash
# Script de construção para o Render

# Executa as migrações do Prisma (se necessário)
echo "Gerando Prisma Client..."
npx prisma generate

# Verifica se a migração do banco de dados é necessária
# Descomente as próximas linhas se quiser fazer migrações automáticas
# echo "Executando migrações de banco de dados..."
# npx prisma migrate deploy

# Criar diretórios necessários
mkdir -p dist/node_modules/.prisma
mkdir -p dist/node_modules/@prisma

# Copiar arquivos necessários do Prisma
echo "Copiando arquivos do Prisma..."
cp -R node_modules/.prisma dist/node_modules/
cp -R node_modules/@prisma dist/node_modules/

echo "Build concluído com sucesso!"
exit 0 