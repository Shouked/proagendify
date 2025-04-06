#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

// Função para logging colorido
const log = {
  info: (msg) => console.log(`${colors.fg.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.fg.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.fg.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.fg.red}[ERROR]${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.fg.magenta}${colors.bright}${msg}${colors.reset}\n`)
};

// Função para verificar se um diretório existe e criar se não existir
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.info(`Diretório criado: ${dir}`);
  }
};

// Função para converter o tipo do campo do MCP para o tipo do Prisma
const mapFieldTypeToPrisma = (fieldType) => {
  if (fieldType === 'string') return 'String';
  if (fieldType === 'number') return 'Float';
  if (fieldType === 'text') return 'String?';
  if (fieldType === 'datetime') return 'DateTime';
  if (fieldType.startsWith('enum:')) {
    const enumName = fieldType.split(':')[0].charAt(0).toUpperCase() + fieldType.split(':')[0].slice(1);
    return enumName;
  }
  if (fieldType.startsWith('foreign:')) {
    return fieldType.split(':')[1];
  }
  return fieldType;
};

// Função para converter os campos MCP para atributos Prisma
const mapFieldToPrismaAttribute = (fieldName, fieldType, modelName) => {
  if (fieldName === 'id') {
    return '@id @default(uuid())';
  }
  if (fieldName === 'email' && modelName === 'User') {
    return '@unique';
  }
  if (fieldType === 'text') {
    return '?';
  }
  if (fieldName.endsWith('Id') && fieldType.startsWith('foreign:')) {
    return '';
  }
  return '';
};

// Função para gerar schema do Prisma a partir do MCP
const generatePrismaSchema = (mcp) => {
  let prismaSchema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

  // Define enums primeiro
  const enums = new Set();
  mcp.models.forEach(model => {
    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.startsWith('enum:')) {
        const [_, values] = fieldType.split(':');
        const enumName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        const enumValues = values.split('|');

        let enumDefinition = `enum ${enumName} {\n`;
        enumValues.forEach(value => {
          enumDefinition += `  ${value}\n`;
        });
        enumDefinition += '}\n\n';

        enums.add(enumDefinition);
      }
    });
  });

  // Adiciona os enums ao schema
  enums.forEach(enumDef => {
    prismaSchema += enumDef;
  });

  // Gera modelos
  mcp.models.forEach(model => {
    prismaSchema += `model ${model.name} {\n`;

    // Campos básicos
    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.startsWith('foreign:')) {
        const relatedModel = fieldType.split(':')[1];
        prismaSchema += `  ${fieldName.replace('Id', '')}    ${relatedModel}          @relation(fields: [${fieldName}], references: [id])\n`;
        prismaSchema += `  ${fieldName}  String\n`;
      } else if (fieldType.startsWith('enum:')) {
        const enumName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        const defaultValue = fieldType.split('|')[0].split(':')[1];
        prismaSchema += `  ${fieldName}      ${enumName}     @default(${defaultValue})\n`;
      } else {
        const prismaType = mapFieldTypeToPrisma(fieldType);
        const attribute = mapFieldToPrismaAttribute(fieldName, fieldType, model.name);
        prismaSchema += `  ${fieldName}      ${prismaType}${attribute ? ' ' + attribute : ''}\n`;
      }
    });

    // Campos de data de criação e atualização
    prismaSchema += `  createdAt DateTime @default(now())\n`;
    prismaSchema += `  updatedAt DateTime @updatedAt\n`;

    // Relações reversas (se for Client ou Service)
    if (model.name === 'Client' || model.name === 'Service') {
      prismaSchema += `\n  appointments Appointment[]\n`;
    }

    // Índices
    prismaSchema += `\n  @@index([tenantId])\n`;

    // Adiciona índices para chaves estrangeiras
    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldName.endsWith('Id') && fieldType.startsWith('foreign:')) {
        prismaSchema += `  @@index([${fieldName}])\n`;
      }
    });

    prismaSchema += '}\n\n';
  });

  return prismaSchema;
};

// Função para gerar arquivos de tipo TypeScript para frontend
const generateTypeDefinitions = (mcp) => {
  let typesContent = `// Tipos gerados automaticamente a partir do MCP
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE

export type TenantId = string;

`;

  // Gerar enums
  mcp.models.forEach(model => {
    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldType.startsWith('enum:')) {
        const [_, values] = fieldType.split(':');
        const enumName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        const enumValues = values.split('|');

        typesContent += `export enum ${enumName} {\n`;
        enumValues.forEach(value => {
          typesContent += `  ${value.toUpperCase()} = "${value}",\n`;
        });
        typesContent += '}\n\n';
      }
    });
  });

  // Gerar interfaces para cada modelo
  mcp.models.forEach(model => {
    typesContent += `export interface ${model.name} {\n`;

    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      let tsType = 'string';

      if (fieldType === 'number') {
        tsType = 'number';
      } else if (fieldType === 'datetime') {
        tsType = 'Date';
      } else if (fieldType === 'text') {
        tsType = 'string | null';
      } else if (fieldType.startsWith('enum:')) {
        tsType = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      } else if (fieldType.startsWith('foreign:')) {
        tsType = 'string'; // ID de referência
      }

      typesContent += `  ${fieldName}: ${tsType};\n`;
    });

    // Adicionar campos de data
    typesContent += `  createdAt: Date;\n`;
    typesContent += `  updatedAt: Date;\n`;

    typesContent += '}\n\n';

    // Gerar tipo para criação (sem id, createdAt, updatedAt)
    typesContent += `export interface Create${model.name}Input {\n`;

    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldName !== 'id') {
        let tsType = 'string';

        if (fieldType === 'number') {
          tsType = 'number';
        } else if (fieldType === 'datetime') {
          tsType = 'Date';
        } else if (fieldType === 'text') {
          tsType = 'string | null';
        } else if (fieldType.startsWith('enum:')) {
          tsType = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        } else if (fieldType.startsWith('foreign:')) {
          tsType = 'string'; // ID de referência
        }

        const isOptional = fieldType === 'text' || fieldName === 'tenantId';
        typesContent += `  ${fieldName}${isOptional ? '?' : ''}: ${tsType};\n`;
      }
    });

    typesContent += '}\n\n';

    // Gerar tipo para atualização (todos os campos são opcionais exceto id)
    typesContent += `export interface Update${model.name}Input {\n`;
    typesContent += '  id: string;\n';

    Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
      if (fieldName !== 'id') {
        let tsType = 'string';

        if (fieldType === 'number') {
          tsType = 'number';
        } else if (fieldType === 'datetime') {
          tsType = 'Date';
        } else if (fieldType === 'text') {
          tsType = 'string | null';
        } else if (fieldType.startsWith('enum:')) {
          tsType = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        } else if (fieldType.startsWith('foreign:')) {
          tsType = 'string'; // ID de referência
        }

        typesContent += `  ${fieldName}?: ${tsType};\n`;
      }
    });

    typesContent += '}\n\n';
  });

  return typesContent;
};

// Início do processo de sincronização
log.title('🚀 INICIANDO SINCRONIZAÇÃO MCP');

// Lê o arquivo mcp.json
try {
  const mcpFile = fs.readFileSync(path.join(__dirname, 'mcp.json'), 'utf8');
  const mcp = JSON.parse(mcpFile);
  log.info('Arquivo mcp.json carregado com sucesso');

  // 1. Gera o arquivo mcp-full.json
  log.info('Gerando arquivo mcp-full.json...');
  execSync('node generateFullMCP.js');
  log.success('Arquivo mcp-full.json gerado com sucesso');

  // 2. Atualiza o schema do Prisma
  log.info('Atualizando schema do Prisma...');
  const prismaDir = path.join(__dirname, 'backend', 'prisma');
  ensureDirectoryExists(prismaDir);

  const prismaSchema = generatePrismaSchema(mcp);
  fs.writeFileSync(path.join(prismaDir, 'schema.prisma'), prismaSchema);
  log.success('Schema do Prisma atualizado com sucesso');

  // 3. Atualiza os tipos do TypeScript para o frontend
  log.info('Atualizando tipos TypeScript...');
  const typesDir = path.join(__dirname, 'frontend', 'src', 'types');
  ensureDirectoryExists(typesDir);

  const typeDefinitions = generateTypeDefinitions(mcp);
  fs.writeFileSync(path.join(typesDir, 'models.ts'), typeDefinitions);
  log.success('Tipos TypeScript atualizados com sucesso');

  // 4. Gera a documentação do projeto
  log.info('Gerando documentação do projeto...');
  execSync('node generateMCPDocs.js');
  log.success('Documentação gerada com sucesso');

  log.title('✅ SINCRONIZAÇÃO MCP CONCLUÍDA COM SUCESSO');
} catch (error) {
  log.error(`Erro durante a sincronização: ${error.message}`);
  process.exit(1);
}
