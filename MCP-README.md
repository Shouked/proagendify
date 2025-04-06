# 🧠 Sistema MCP (Model-Code-Project)

O sistema MCP (Model-Code-Project) é uma abordagem para manter a sincronização entre seus modelos de dados, código e documentação. Com o MCP, você pode definir seus modelos em um único arquivo JSON e gerar automaticamente:

- Schema do banco de dados (Prisma)
- Tipos TypeScript
- Documentação abrangente
- Rotas e controllers (via mcp-full.json)

## 📋 Estrutura de Arquivos

```
proagendify/
├── mcp.json                 # Arquivo principal (fonte da verdade)
├── mcp-full.json            # Versão expandida com detalhes adicionais
├── DOCUMENTATION.md         # Documentação gerada automaticamente
├── generateFullMCP.js       # Script para gerar mcp-full.json
├── generateMCPDocs.js       # Script para gerar documentação
├── syncMCP.js               # Script para sincronizar alterações
└── addMCPModel.js           # Script para adicionar novos modelos
```

## 🚀 Como Usar

### Visualizar a Estrutura do Projeto

O arquivo `DOCUMENTATION.md` contém uma visão completa da estrutura do projeto, incluindo:
- Modelos de dados
- Rotas de API
- Controllers
- Componentes de front-end
- Páginas
- Layouts
- Estratégia de implantação

### Adicionar um Novo Modelo

Para adicionar um novo modelo ao sistema, execute:

```bash
node addMCPModel.js
```

Este utilitário interativo irá:
1. Solicitar o nome do novo modelo (em PascalCase)
2. Adicionar automaticamente campos padrão (id, tenantId)
3. Permitir que você adicione campos adicionais
4. Oferecer várias opções de tipos de campo
5. Atualizar o arquivo mcp.json
6. Oferecer a sincronização automática

### Sincronizar o MCP

Após fazer alterações no arquivo `mcp.json`, sincronize o sistema executando:

```bash
node syncMCP.js
```

Este comando:
1. Gera o arquivo mcp-full.json
2. Atualiza o schema do Prisma
3. Atualiza os tipos TypeScript
4. Gera documentação atualizada

## 🔍 Tipos de Campo Disponíveis

O MCP suporta os seguintes tipos de campo:

- `string` - Texto curto
- `number` - Valores numéricos
- `text` - Texto longo (opcional)
- `datetime` - Data e hora
- `enum:value1|value2|...` - Enumeração com valores permitidos
- `foreign:Model` - Chave estrangeira para outro modelo

## 🛠️ Arquivos Gerados

### Schema do Prisma

O schema do Prisma é gerado em `backend/prisma/schema.prisma` e inclui:
- Todos os modelos definidos no MCP
- Tipos corretos para cada campo
- Relações entre modelos
- Índices para melhoria de desempenho
- Campos adicionais como createdAt e updatedAt

### Tipos TypeScript

Os tipos TypeScript são gerados em `frontend/src/types/models.ts` e incluem:
- Interfaces para cada modelo
- Tipos para inputs de criação (sem campos automáticos)
- Tipos para inputs de atualização (campos opcionais)
- Enums definidos no MCP

## ⚙️ Etapas Adicionais

### Gerar Documentação Separadamente

```bash
node generateMCPDocs.js
```

### Gerar mcp-full.json Separadamente

```bash
node generateFullMCP.js
```

## 🔄 Fluxo de Trabalho Recomendado

1. **Planejamento**: Defina seus modelos e suas relações
2. **Implementação**: Adicione modelos ao mcp.json
3. **Sincronização**: Execute `node syncMCP.js`
4. **Desenvolvimento**: Implemente a lógica de negócios com base nos arquivos gerados
5. **Iteração**: Ao fazer mudanças nos modelos, atualize o mcp.json e sincronize novamente

## 🚨 Boas Práticas

- **Sempre** edite o arquivo mcp.json, nunca os arquivos gerados
- Execute a sincronização após cada alteração
- Verifique a documentação gerada para entender a estrutura completa
- Evite alterações manuais nos arquivos gerados (eles serão substituídos)

---

Desenvolvido como parte do projeto ProAgendify, um SaaS multi-tenant para profissionais da área de beleza/estética.
