export type CustomerStage =
  | 'NEW'
  | 'CONTACTED'
  | 'FOLLOWED_UP'
  | 'PRESENTED'
  | 'DEAL'
  | 'REJECTED';

export type CustomerSource =
  | 'WALK_IN'
  | 'REFERRAL'
  | 'SOCIAL_MEDIA'
  | 'WEBSITE'
  | 'OTHER';

export type InteractionType =
  | 'CALL'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'MEETING'
  | 'PRESENTATION'
  | 'FOLLOW_UP'
  | 'NOTE';

export type InteractionResult = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'NO_RESPONSE';

export type Role = 'ADMIN' | 'SALES';

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
  path: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface MotorModel {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  customerId: string;
  motorModelId: string;
  salespersonId: string;
  finalPrice: number;
  unitSold: number;
  dealDate: string;
  notes?: string | null;
  motorModel?: MotorModel;
}

export interface Interaction {
  id: string;
  customerId: string;
  userId: string;
  type: InteractionType;
  result?: InteractionResult | null;
  notes: string;
  followUpDate?: string | null;
  createdAt: string;
  user?: { id: string; name: string };
}

export interface StageHistoryEntry {
  id: string;
  customerId: string;
  changedById: string;
  fromStage: CustomerStage;
  toStage: CustomerStage;
  notes?: string | null;
  changedAt: string;
  changedBy?: { id: string; name: string };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  source: CustomerSource;
  stage: CustomerStage;
  interestedMotorId?: string | null;
  interestedMotor?: MotorModel | null;
  salespersonId: string;
  salesperson?: { id: string; name: string; email: string };
  deal?: Deal | null;
  interactions?: Interaction[];
  stageHistory?: StageHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalCustomers: number;
  pipelineByStage: Record<CustomerStage, number>;
  totalDeals: number;
  totalRejected: number;
  conversionRate: number;
  totalRevenue: number;
  totalUnitSold: number;
  topSalespersons: {
    salespersonId: string;
    name: string;
    totalDeals: number;
    totalUnitSold: number;
  }[];
}