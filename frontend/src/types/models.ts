// Tipos gerados automaticamente a partir do MCP
// NÃO EDITE ESTE ARQUIVO DIRETAMENTE

export type TenantId = string;

export enum Role {
  SUPERADMIN = "superadmin",
  PROFESSIONAL = "professional",
  CLIENT = "client",
}

export enum Status {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  tenantId?: string;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  tenantId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
  tenantId?: string;
}

export interface UpdateClientInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string | null;
  tenantId?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  name: string;
  price: number;
  duration: number;
  description?: string | null;
  tenantId?: string;
}

export interface UpdateServiceInput {
  id: string;
  name?: string;
  price?: number;
  duration?: number;
  description?: string | null;
  tenantId?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: Date;
  status: Status;
  notes: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentInput {
  clientId: string;
  serviceId: string;
  date: Date;
  status: Status;
  notes?: string | null;
  tenantId?: string;
}

export interface UpdateAppointmentInput {
  id: string;
  clientId?: string;
  serviceId?: string;
  date?: Date;
  status?: Status;
  notes?: string | null;
  tenantId?: string;
}

