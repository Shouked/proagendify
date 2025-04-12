#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lê o arquivo mcp.json
const mcpFile = fs.readFileSync(path.join(__dirname, 'mcp.json'), 'utf8');
const mcp = JSON.parse(mcpFile);

// Função para gerar o primeiro caractere em minúsculo
const lowercaseFirst = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

// Função para gerar o nome de rota a partir do modelo
const routeName = (modelName) => {
  return lowercaseFirst(modelName) + 's';
};

// Função para gerar endpoints para cada modelo
const generateEndpoints = (model) => {
  const basePath = `/${routeName(model.name)}`;
  return {
    basePath,
    endpoints: [
      {
        path: basePath,
        method: 'GET',
        description: `Listar todos os ${routeName(model.name)}`,
        controller: `get${model.name}s`,
        middleware: ['auth', 'tenant']
      },
      {
        path: `${basePath}/:id`,
        method: 'GET',
        description: `Obter ${lowercaseFirst(model.name)} por ID`,
        controller: `get${model.name}`,
        middleware: ['auth', 'tenant']
      },
      {
        path: basePath,
        method: 'POST',
        description: `Criar ${lowercaseFirst(model.name)}`,
        controller: `create${model.name}`,
        middleware: ['auth', 'tenant']
      },
      {
        path: `${basePath}/:id`,
        method: 'PUT',
        description: `Atualizar ${lowercaseFirst(model.name)}`,
        controller: `update${model.name}`,
        middleware: ['auth', 'tenant']
      },
      {
        path: `${basePath}/:id`,
        method: 'DELETE',
        description: `Excluir ${lowercaseFirst(model.name)}`,
        controller: `delete${model.name}`,
        middleware: ['auth', 'tenant']
      }
    ]
  };
};

// Gera componentes frontend para cada modelo
const generateFrontendComponents = (model) => {
  return {
    components: [
      `${model.name}List`,
      `${model.name}Form`,
      `${model.name}Detail`,
      `${model.name}Card`
    ],
    pages: [
      `/dashboard/${routeName(model.name)}`,
      `/dashboard/${routeName(model.name)}/new`,
      `/dashboard/${routeName(model.name)}/:id`,
      `/dashboard/${routeName(model.name)}/:id/edit`
    ]
  };
};

// Constrói o objeto completo do MCP com todas as informações
const fullMCP = {
  name: 'ProAgendify',
  version: '1.0.0',
  models: mcp.models,
  backend: {
    routes: mcp.models.map(model => generateEndpoints(model)),
    controllers: mcp.models.map(model => {
      return {
        name: `${model.name}Controller`,
        methods: [
          `get${model.name}s`,
          `get${model.name}`,
          `create${model.name}`,
          `update${model.name}`,
          `delete${model.name}`
        ]
      };
    }),
    middleware: [
      {
        name: 'auth',
        description: 'Autentica o usuário via JWT'
      },
      {
        name: 'tenant',
        description: 'Verifica e valida o tenantId para operações multi-tenant'
      }
    ]
  },
  frontend: {
    components: mcp.models.reduce((acc, model) => {
      const components = generateFrontendComponents(model);
      acc.push(...components.components);
      return acc;
    }, []),
    pages: [
      '/login',
      '/register',
      '/dashboard',
      ...mcp.models.reduce((acc, model) => {
        const components = generateFrontendComponents(model);
        acc.push(...components.pages);
        return acc;
      }, [])
    ],
    layouts: [
      'AuthLayout',
      'DashboardLayout',
      'ClientLayout'
    ]
  },
  deployment: {
    frontend: {
      platform: 'Vercel',
      url: 'https://proagendify.vercel.app'
    },
    backend: {
      platform: 'Render',
      url: 'https://proagendify-api.onrender.com'
    },
    database: {
      platform: 'Neon',
      type: 'PostgreSQL'
    }
  }
};

// Escreve o resultado em um arquivo JSON
fs.writeFileSync(
  path.join(__dirname, 'mcp-full.json'),
  JSON.stringify(fullMCP, null, 2),
  'utf8'
);

console.log('Arquivo mcp-full.json gerado com sucesso!');
