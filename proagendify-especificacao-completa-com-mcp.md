# 🧠 PROAGENDIFY – Especificação Completa para Criação de um Projeto SaaS Multi-Tenant

Este documento deve ser interpretado por um Agente de IA (como Cursor AI) para gerar um projeto completo e funcional.

---

## 🎯 Objetivo

Criar um aplicativo web SaaS completo para profissionais autônomos da área da beleza/estética. O sistema deve permitir agendamento online, controle de clientes, serviços, estoque, relatórios financeiros e muito mais. A plataforma deve ser multi-tenant com dados isolados por tenant (profissional) e uma experiência premium com foco mobile-first.

---

## 📦 Estrutura Esperada do Projeto

```
proagendify/
├── frontend/           # Next.js + Tailwind (mobile-first, PWA)
├── backend/            # Node.js + Express + Prisma ORM
├── shared/             # Hooks, middlewares, modelos reutilizáveis
├── docker-compose.yml
└── README.md
```

---

## ✅ O Agente DEVE:

1. Criar a estrutura completa do projeto com frontend e backend separados.
2. Implementar autenticação com JWT, com três níveis de usuário:
   - superadmin (painel geral da plataforma)
   - profissional (admin do tenant)
   - cliente (usuário final que agenda serviços)
3. Utilizar PostgreSQL com suporte a multi-tenant por `tenantId`.
4. Incluir middlewares para validar `tenantId` e tipo de usuário.
5. Garantir responsividade e experiência mobile com PWA no frontend.
6. Criar endpoints RESTful e documentação com Swagger.
7. Usar Render (backend), Vercel (frontend) e Neon (banco de dados) como plataformas de deploy gratuito.
8. Usar Prisma ORM com schema multi-tenant (estrutura flexível por tenant).
9. Utilizar somente ferramentas gratuitas (evitar dependências pagas).
10. Criar sistema completo com as seguintes funcionalidades:

---

### Painel do Profissional
- Dashboard com KPIs diários
- Agenda com bloqueio de horários (visão diária, semanal e mensal)
- Cadastro de clientes, com histórico e anotações
- Cadastro de serviços com duração e preço
- Gerenciamento de estoque com alertas
- Controle financeiro com receitas e despesas
- Criação de pacotes de serviços
- Configuração de horários disponíveis por dia da semana
- Notificações (push, e-mail, SMS)

### Painel do Cliente
- Link público (slug) para agendamento
- Escolha de serviço, data e horário com base na disponibilidade
- Confirmação por e-mail/SMS
- Histórico de agendamentos e reagendamentos

### Painel do Super Admin (SaaS)
- Gestão de todos os tenants (profissionais)
- Criação e edição de planos pagos (trial, mensal, anual)
- Relatórios de uso da plataforma
- Controle de comissões e white-label
- Personalização de identidade visual por tenant
- Integração com Stripe para cobrança recorrente

---

## 📊 Relatórios e Análises

- Faturamento diário, semanal, mensal, anual
- Serviços mais lucrativos e mais agendados
- Ocupação de agenda e períodos ociosos
- Retenção de clientes e frequência de retorno
- Gráficos responsivos adaptados para dispositivos móveis

---

## ⚙️ Tecnologias Recomendadas

### Frontend
- Next.js + Tailwind CSS
- Zustand ou Context API
- PWA com instalação em smartphones
- Deploy no Vercel

### Backend
- Node.js com Express
- Prisma ORM com PostgreSQL (Neon)
- JWT para autenticação
- Deploy no Render

### Integrações
- Stripe para pagamentos
- Firebase para push notifications
- Google Calendar para sincronização
- WhatsApp API + SMS (Zenvia, Twilio ou TotalVoice)

---

## 📋 Funcionalidades prioritárias que devem ser implementadas primeiro

1. Sistema de agendamento com bloqueio de horários
2. Cadastro de clientes e serviços
3. Definição da duração de cada procedimento
4. Visualização da agenda com cores por status
5. Controle financeiro por procedimento
6. Relatórios financeiros

---

## 🚀 Instruções finais

- Este projeto será usado como base comercial (SaaS).
- Cada tenant (profissional) deve ter dados isolados e seguros.
- O projeto deve ser facilmente escalável e modular.
- Todas as funções devem funcionar perfeitamente em mobile e desktop.

✅ Após interpretar este documento, gere toda a estrutura do projeto com os arquivos, pastas e configurações necessários.

---

## 🧠 Uso do MCP Server

Este projeto utilizará um **MCP Server (Model-Code-Project)** para garantir consistência entre os modelos de dados, código backend, frontend e banco de dados.

### ✅ Crie um arquivo `mcp.json` na raiz do projeto com o seguinte conteúdo inicial:

```json
{
  "models": [
    {
      "name": "User",
      "fields": {
        "id": "string",
        "name": "string",
        "email": "string",
        "password": "string",
        "role": "enum:superadmin|professional|client",
        "tenantId": "string"
      }
    },
    {
      "name": "Client",
      "fields": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "notes": "text",
        "tenantId": "string"
      }
    },
    {
      "name": "Service",
      "fields": {
        "id": "string",
        "name": "string",
        "price": "number",
        "duration": "number",
        "description": "text",
        "tenantId": "string"
      }
    },
    {
      "name": "Appointment",
      "fields": {
        "id": "string",
        "clientId": "foreign:Client",
        "serviceId": "foreign:Service",
        "date": "datetime",
        "status": "enum:scheduled|completed|canceled",
        "notes": "text",
        "tenantId": "string"
      }
    }
  ]
}
```

### ⚙️ A cada modificação no `mcp.json`, o agente deve:

- Atualizar o schema do banco (Prisma)
- Atualizar os controllers e rotas do backend
- Atualizar os formulários e componentes no frontend
- Garantir sincronização entre todos os arquivos
- Evitar arquivos duplicados ou inconsistentes



## 🚨 Importante

Este projeto deve **sempre manter o `mcp.json` como fonte de verdade (source of truth)**.  
Todas as alterações em modelos, campos ou relacionamentos devem partir desse arquivo.  
Isso evita inconsistência, retrabalho e perda de contexto durante sessões longas no Cursor AI.
