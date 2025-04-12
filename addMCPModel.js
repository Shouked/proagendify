#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  }
};

// Função para logging colorido
const clog = (color, text) => console.log(`${color}${text}${colors.reset}`);

// Criar interface de linha de comando interativa
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para perguntar
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Função principal para adicionar modelo
async function addModel() {
  clog(colors.fg.cyan, '\n=== ADICIONAR NOVO MODELO AO MCP ===\n');

  // Ler o arquivo mcp.json
  const mcpFilePath = path.join(__dirname, 'mcp.json');
  const mcp = JSON.parse(fs.readFileSync(mcpFilePath, 'utf8'));

  // Pedir o nome do modelo
  const modelName = await question(colors.fg.yellow + 'Nome do modelo (PascalCase): ' + colors.reset);

  if (!modelName || !modelName.match(/^[A-Z][a-zA-Z0-9]*$/)) {
    clog(colors.fg.red, 'Erro: Nome do modelo deve estar em PascalCase (ex: Product, OrderItem)');
    rl.close();
    return;
  }

  // Verificar se o modelo já existe
  if (mcp.models.some(m => m.name === modelName)) {
    clog(colors.fg.red, `Erro: Modelo "${modelName}" já existe no MCP`);
    rl.close();
    return;
  }

  const fields = {};

  // Adicionar campo ID automaticamente
  fields.id = 'string';

  // Adicionar campo tenantId automaticamente
  fields.tenantId = 'string';

  clog(colors.fg.cyan, '\nAdicione os campos do modelo (id e tenantId já adicionados)');
  clog(colors.fg.cyan, 'Para finalizar, deixe o nome do campo em branco\n');

  let addingFields = true;

  while (addingFields) {
    const fieldName = await question(colors.fg.yellow + 'Nome do campo: ' + colors.reset);

    if (!fieldName) {
      addingFields = false;
      continue;
    }

    if (fields[fieldName]) {
      clog(colors.fg.red, `Campo "${fieldName}" já existe no modelo`);
      continue;
    }

    clog(colors.fg.cyan, 'Tipos disponíveis:');
    clog(colors.fg.green, '1. string - Texto curto');
    clog(colors.fg.green, '2. number - Número');
    clog(colors.fg.green, '3. text - Texto longo (opcional)');
    clog(colors.fg.green, '4. datetime - Data e hora');
    clog(colors.fg.green, '5. enum:value1|value2|... - Enumeração');
    clog(colors.fg.green, '6. foreign:Model - Chave estrangeira');

    const fieldTypeChoice = await question(colors.fg.yellow + 'Tipo do campo (1-6): ' + colors.reset);

    let fieldType;

    switch (fieldTypeChoice) {
      case '1':
        fieldType = 'string';
        break;
      case '2':
        fieldType = 'number';
        break;
      case '3':
        fieldType = 'text';
        break;
      case '4':
        fieldType = 'datetime';
        break;
      case '5':
        const enumValues = await question(colors.fg.yellow + 'Valores da enumeração (separados por |): ' + colors.reset);
        if (!enumValues) {
          clog(colors.fg.red, 'Valores da enumeração são obrigatórios');
          continue;
        }
        fieldType = `enum:${enumValues}`;
        break;
      case '6':
        // Mostrar os modelos existentes
        clog(colors.fg.cyan, '\nModelos disponíveis:');
        mcp.models.forEach((model, index) => {
          clog(colors.fg.green, `${index + 1}. ${model.name}`);
        });

        const modelChoice = await question(colors.fg.yellow + 'Modelo de referência (Digite o número): ' + colors.reset);
        const selectedModelIndex = parseInt(modelChoice) - 1;

        if (isNaN(selectedModelIndex) || selectedModelIndex < 0 || selectedModelIndex >= mcp.models.length) {
          clog(colors.fg.red, 'Escolha de modelo inválida');
          continue;
        }

        const selectedModel = mcp.models[selectedModelIndex];
        fieldType = `foreign:${selectedModel.name}`;
        break;
      default:
        clog(colors.fg.red, 'Escolha inválida');
        continue;
    }

    fields[fieldName] = fieldType;
    clog(colors.fg.green, `Campo "${fieldName}" (${fieldType}) adicionado com sucesso\n`);
  }

  // Adicionar novo modelo ao MCP
  mcp.models.push({
    name: modelName,
    fields: fields
  });

  // Salvar o arquivo MCP atualizado
  fs.writeFileSync(mcpFilePath, JSON.stringify(mcp, null, 2), 'utf8');

  clog(colors.fg.green, `\nModelo "${modelName}" adicionado com sucesso ao MCP!`);

  // Perguntar se deseja sincronizar o MCP
  const syncNow = await question(colors.fg.yellow + 'Deseja sincronizar o MCP agora? (s/n): ' + colors.reset);

  if (syncNow.toLowerCase() === 's') {
    clog(colors.fg.cyan, '\nSincronizando MCP...');
    try {
      execSync('node syncMCP.js', { stdio: 'inherit' });
    } catch (error) {
      clog(colors.fg.red, `Erro ao sincronizar: ${error.message}`);
    }
  }

  rl.close();
}

// Iniciar o script
addModel().catch(error => {
  console.error('Erro:', error);
  rl.close();
});
