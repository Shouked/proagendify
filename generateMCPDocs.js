#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Lê o arquivo mcp-full.json
const mcpFullFile = fs.readFileSync(path.join(__dirname, 'mcp-full.json'), 'utf8');
const mcpFull = JSON.parse(mcpFullFile);

// Gera a documentação em markdown
let markdown = `# ${mcpFull.name} - Documentação do Projeto

Versão: ${mcpFull.version}

## 📋 Índice

1. [Modelos de Dados](#modelos-de-dados)
2. [Backend](#backend)
   - [Rotas](#rotas)
   - [Controllers](#controllers)
   - [Middlewares](#middlewares)
3. [Frontend](#frontend)
   - [Componentes](#componentes)
   - [Páginas](#páginas)
   - [Layouts](#layouts)
4. [Implantação](#implantação)

## Modelos de Dados

O sistema utiliza os seguintes modelos de dados:

`;

// Documentação dos modelos
mcpFull.models.forEach(model => {
  markdown += `### ${model.name}\n\n`;
  markdown += '| Campo | Tipo | Descrição |\n';
  markdown += '| ----- | ---- | --------- |\n';

  Object.entries(model.fields).forEach(([fieldName, fieldType]) => {
    let description = '';

    if (fieldName === 'id') {
      description = 'Identificador único';
    } else if (fieldName === 'tenantId') {
      description = 'ID do tenant (multi-tenancy)';
    } else if (fieldType.startsWith('enum:')) {
      const enumValues = fieldType.split(':')[1].split('|');
      description = `Enum: ${enumValues.join(', ')}`;
    } else if (fieldType.startsWith('foreign:')) {
      const foreignModel = fieldType.split(':')[1];
      description = `Chave estrangeira para ${foreignModel}`;
    } else {
      description = `Campo do tipo ${fieldType}`;
    }

    markdown += `| ${fieldName} | ${fieldType} | ${description} |\n`;
  });

  markdown += '\n';
});

// Documentação do backend
markdown += `## Backend

O backend fornece uma API RESTful para interação com os dados.

### Rotas

`;

// Documentação das rotas
mcpFull.backend.routes.forEach(route => {
  markdown += `#### ${route.basePath}\n\n`;
  markdown += '| Método | Rota | Descrição | Controller | Middleware |\n';
  markdown += '| ------ | ---- | --------- | ---------- | ---------- |\n';

  route.endpoints.forEach(endpoint => {
    markdown += `| ${endpoint.method} | ${endpoint.path} | ${endpoint.description} | ${endpoint.controller} | ${endpoint.middleware.join(', ')} |\n`;
  });

  markdown += '\n';
});

// Documentação dos controllers
markdown += `### Controllers

`;

mcpFull.backend.controllers.forEach(controller => {
  markdown += `#### ${controller.name}\n\n`;
  markdown += '| Método | Descrição |\n';
  markdown += '| ------ | --------- |\n';

  controller.methods.forEach(method => {
    let description = '';

    if (method.startsWith('get') && method.endsWith('s')) {
      description = `Listar todos os ${method.replace('get', '').toLowerCase()}`;
    } else if (method.startsWith('get')) {
      description = `Obter ${method.replace('get', '').toLowerCase()} por ID`;
    } else if (method.startsWith('create')) {
      description = `Criar novo ${method.replace('create', '').toLowerCase()}`;
    } else if (method.startsWith('update')) {
      description = `Atualizar ${method.replace('update', '').toLowerCase()} existente`;
    } else if (method.startsWith('delete')) {
      description = `Excluir ${method.replace('delete', '').toLowerCase()}`;
    }

    markdown += `| ${method} | ${description} |\n`;
  });

  markdown += '\n';
});

// Documentação dos middlewares
markdown += `### Middlewares

`;

mcpFull.backend.middleware.forEach(middleware => {
  markdown += `#### ${middleware.name}\n\n`;
  markdown += `${middleware.description}\n\n`;
});

// Documentação do frontend
markdown += `## Frontend

O frontend do sistema é construído com Next.js e Tailwind CSS, seguindo uma abordagem mobile-first.

### Componentes

`;

// Agrupar componentes por modelo
const componentsByModel = {};

mcpFull.frontend.components.forEach(component => {
  // Extrair o nome do modelo do componente (ex: UserList -> User)
  const modelName = component.replace(/List|Form|Detail|Card/g, '');

  if (!componentsByModel[modelName]) {
    componentsByModel[modelName] = [];
  }

  componentsByModel[modelName].push(component);
});

// Documentação dos componentes
Object.entries(componentsByModel).forEach(([modelName, components]) => {
  markdown += `#### Componentes de ${modelName}\n\n`;
  markdown += '| Componente | Descrição |\n';
  markdown += '| ---------- | --------- |\n';

  components.forEach(component => {
    let description = '';

    if (component.endsWith('List')) {
      description = `Lista de ${modelName.toLowerCase()}s com filtros e paginação`;
    } else if (component.endsWith('Form')) {
      description = `Formulário para criar/editar ${modelName.toLowerCase()}`;
    } else if (component.endsWith('Detail')) {
      description = `Visualização detalhada de ${modelName.toLowerCase()}`;
    } else if (component.endsWith('Card')) {
      description = `Card resumido de ${modelName.toLowerCase()} para listagens`;
    }

    markdown += `| ${component} | ${description} |\n`;
  });

  markdown += '\n';
});

// Documentação das páginas
markdown += `### Páginas

`;

// Agrupar páginas por seção
const pagesBySection = {
  'Autenticação': mcpFull.frontend.pages.filter(page => page.startsWith('/login') || page.startsWith('/register')),
  'Dashboard': mcpFull.frontend.pages.filter(page => page === '/dashboard'),
  'Módulos': mcpFull.frontend.pages.filter(page => page.startsWith('/dashboard/') && page !== '/dashboard')
};

// Documentação das páginas
Object.entries(pagesBySection).forEach(([section, pages]) => {
  markdown += `#### ${section}\n\n`;
  markdown += '| Rota | Descrição |\n';
  markdown += '| ---- | --------- |\n';

  pages.forEach(page => {
    let description = '';

    if (page === '/login') {
      description = 'Página de login para acesso ao sistema';
    } else if (page === '/register') {
      description = 'Registro de novo profissional/tenant';
    } else if (page === '/dashboard') {
      description = 'Dashboard principal com KPIs e indicadores';
    } else if (page.endsWith('/new')) {
      const entity = page.split('/')[2];
      description = `Criar novo ${entity}`;
    } else if (page.includes('/:id/edit')) {
      const entity = page.split('/')[2];
      description = `Editar ${entity}`;
    } else if (page.includes('/:id')) {
      const entity = page.split('/')[2];
      description = `Visualizar detalhes de ${entity}`;
    } else {
      const entity = page.split('/')[2];
      description = `Listar todos os ${entity}`;
    }

    markdown += `| ${page} | ${description} |\n`;
  });

  markdown += '\n';
});

// Documentação dos layouts
markdown += `### Layouts

`;

mcpFull.frontend.layouts.forEach(layout => {
  let description = '';

  if (layout === 'AuthLayout') {
    description = 'Layout para páginas de autenticação (login/registro)';
  } else if (layout === 'DashboardLayout') {
    description = 'Layout principal para páginas logadas com sidebar e header';
  } else if (layout === 'ClientLayout') {
    description = 'Layout para páginas públicas de agendamento';
  }

  markdown += `- **${layout}**: ${description}\n`;
});

markdown += '\n';

// Documentação da implantação
markdown += `## Implantação

O sistema está configurado para implantação nas seguintes plataformas:

- **Frontend**: ${mcpFull.deployment.frontend.platform} (${mcpFull.deployment.frontend.url})
- **Backend**: ${mcpFull.deployment.backend.platform} (${mcpFull.deployment.backend.url})
- **Banco de Dados**: ${mcpFull.deployment.database.platform} (${mcpFull.deployment.database.type})

---

Documentação gerada automaticamente a partir do MCP (Model-Code-Project).
`;

// Escreve o resultado em um arquivo markdown
fs.writeFileSync(
  path.join(__dirname, 'DOCUMENTATION.md'),
  markdown,
  'utf8'
);

console.log('Arquivo DOCUMENTATION.md gerado com sucesso!');
