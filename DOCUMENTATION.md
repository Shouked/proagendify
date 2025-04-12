# ProAgendify - Documentação do Projeto

Versão: 1.0.0

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

### User

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | string | Identificador único |
| name | string | Campo do tipo string |
| email | string | Campo do tipo string |
| password | string | Campo do tipo string |
| role | enum:superadmin|professional|client | Enum: superadmin, professional, client |
| tenantId | string | ID do tenant (multi-tenancy) |

### Client

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | string | Identificador único |
| name | string | Campo do tipo string |
| email | string | Campo do tipo string |
| phone | string | Campo do tipo string |
| notes | text | Campo do tipo text |
| tenantId | string | ID do tenant (multi-tenancy) |

### Service

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | string | Identificador único |
| name | string | Campo do tipo string |
| price | number | Campo do tipo number |
| duration | number | Campo do tipo number |
| description | text | Campo do tipo text |
| tenantId | string | ID do tenant (multi-tenancy) |

### Appointment

| Campo | Tipo | Descrição |
| ----- | ---- | --------- |
| id | string | Identificador único |
| clientId | foreign:Client | Chave estrangeira para Client |
| serviceId | foreign:Service | Chave estrangeira para Service |
| date | datetime | Campo do tipo datetime |
| status | enum:scheduled|completed|canceled | Enum: scheduled, completed, canceled |
| notes | text | Campo do tipo text |
| tenantId | string | ID do tenant (multi-tenancy) |

## Backend

O backend fornece uma API RESTful para interação com os dados.

### Rotas

#### /users

| Método | Rota | Descrição | Controller | Middleware |
| ------ | ---- | --------- | ---------- | ---------- |
| GET | /users | Listar todos os users | getUsers | auth, tenant |
| GET | /users/:id | Obter user por ID | getUser | auth, tenant |
| POST | /users | Criar user | createUser | auth, tenant |
| PUT | /users/:id | Atualizar user | updateUser | auth, tenant |
| DELETE | /users/:id | Excluir user | deleteUser | auth, tenant |

#### /clients

| Método | Rota | Descrição | Controller | Middleware |
| ------ | ---- | --------- | ---------- | ---------- |
| GET | /clients | Listar todos os clients | getClients | auth, tenant |
| GET | /clients/:id | Obter client por ID | getClient | auth, tenant |
| POST | /clients | Criar client | createClient | auth, tenant |
| PUT | /clients/:id | Atualizar client | updateClient | auth, tenant |
| DELETE | /clients/:id | Excluir client | deleteClient | auth, tenant |

#### /services

| Método | Rota | Descrição | Controller | Middleware |
| ------ | ---- | --------- | ---------- | ---------- |
| GET | /services | Listar todos os services | getServices | auth, tenant |
| GET | /services/:id | Obter service por ID | getService | auth, tenant |
| POST | /services | Criar service | createService | auth, tenant |
| PUT | /services/:id | Atualizar service | updateService | auth, tenant |
| DELETE | /services/:id | Excluir service | deleteService | auth, tenant |

#### /appointments

| Método | Rota | Descrição | Controller | Middleware |
| ------ | ---- | --------- | ---------- | ---------- |
| GET | /appointments | Listar todos os appointments | getAppointments | auth, tenant |
| GET | /appointments/:id | Obter appointment por ID | getAppointment | auth, tenant |
| POST | /appointments | Criar appointment | createAppointment | auth, tenant |
| PUT | /appointments/:id | Atualizar appointment | updateAppointment | auth, tenant |
| DELETE | /appointments/:id | Excluir appointment | deleteAppointment | auth, tenant |

### Controllers

#### UserController

| Método | Descrição |
| ------ | --------- |
| getUsers | Listar todos os users |
| getUser | Obter user por ID |
| createUser | Criar novo user |
| updateUser | Atualizar user existente |
| deleteUser | Excluir user |

#### ClientController

| Método | Descrição |
| ------ | --------- |
| getClients | Listar todos os clients |
| getClient | Obter client por ID |
| createClient | Criar novo client |
| updateClient | Atualizar client existente |
| deleteClient | Excluir client |

#### ServiceController

| Método | Descrição |
| ------ | --------- |
| getServices | Listar todos os services |
| getService | Obter service por ID |
| createService | Criar novo service |
| updateService | Atualizar service existente |
| deleteService | Excluir service |

#### AppointmentController

| Método | Descrição |
| ------ | --------- |
| getAppointments | Listar todos os appointments |
| getAppointment | Obter appointment por ID |
| createAppointment | Criar novo appointment |
| updateAppointment | Atualizar appointment existente |
| deleteAppointment | Excluir appointment |

### Middlewares

#### auth

Autentica o usuário via JWT

#### tenant

Verifica e valida o tenantId para operações multi-tenant

## Frontend

O frontend do sistema é construído com Next.js e Tailwind CSS, seguindo uma abordagem mobile-first.

### Componentes

#### Componentes de User

| Componente | Descrição |
| ---------- | --------- |
| UserList | Lista de users com filtros e paginação |
| UserForm | Formulário para criar/editar user |
| UserDetail | Visualização detalhada de user |
| UserCard | Card resumido de user para listagens |

#### Componentes de Client

| Componente | Descrição |
| ---------- | --------- |
| ClientList | Lista de clients com filtros e paginação |
| ClientForm | Formulário para criar/editar client |
| ClientDetail | Visualização detalhada de client |
| ClientCard | Card resumido de client para listagens |

#### Componentes de Service

| Componente | Descrição |
| ---------- | --------- |
| ServiceList | Lista de services com filtros e paginação |
| ServiceForm | Formulário para criar/editar service |
| ServiceDetail | Visualização detalhada de service |
| ServiceCard | Card resumido de service para listagens |

#### Componentes de Appointment

| Componente | Descrição |
| ---------- | --------- |
| AppointmentList | Lista de appointments com filtros e paginação |
| AppointmentForm | Formulário para criar/editar appointment |
| AppointmentDetail | Visualização detalhada de appointment |
| AppointmentCard | Card resumido de appointment para listagens |

### Páginas

#### Autenticação

| Rota | Descrição |
| ---- | --------- |
| /login | Página de login para acesso ao sistema |
| /register | Registro de novo profissional/tenant |

#### Dashboard

| Rota | Descrição |
| ---- | --------- |
| /dashboard | Dashboard principal com KPIs e indicadores |

#### Módulos

| Rota | Descrição |
| ---- | --------- |
| /dashboard/users | Listar todos os users |
| /dashboard/users/new | Criar novo users |
| /dashboard/users/:id | Visualizar detalhes de users |
| /dashboard/users/:id/edit | Editar users |
| /dashboard/clients | Listar todos os clients |
| /dashboard/clients/new | Criar novo clients |
| /dashboard/clients/:id | Visualizar detalhes de clients |
| /dashboard/clients/:id/edit | Editar clients |
| /dashboard/services | Listar todos os services |
| /dashboard/services/new | Criar novo services |
| /dashboard/services/:id | Visualizar detalhes de services |
| /dashboard/services/:id/edit | Editar services |
| /dashboard/appointments | Listar todos os appointments |
| /dashboard/appointments/new | Criar novo appointments |
| /dashboard/appointments/:id | Visualizar detalhes de appointments |
| /dashboard/appointments/:id/edit | Editar appointments |

### Layouts

- **AuthLayout**: Layout para páginas de autenticação (login/registro)
- **DashboardLayout**: Layout principal para páginas logadas com sidebar e header
- **ClientLayout**: Layout para páginas públicas de agendamento

## Implantação

O sistema está configurado para implantação nas seguintes plataformas:

- **Frontend**: Vercel (https://proagendify.vercel.app)
- **Backend**: Render (https://proagendify-api.onrender.com)
- **Banco de Dados**: Neon (PostgreSQL)

---

Documentação gerada automaticamente a partir do MCP (Model-Code-Project).
