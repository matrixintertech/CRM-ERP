export type PlanType =
  | "TRIAL"
  | "FREE"
  | "PAID"
  | "ENTERPRISE";

export type BillingCycle =
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY"
  | "LIFETIME";

export type SubscriptionStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface PlanModule {
  id: string;
  name: string;
  code: string;
  icon?: string | null;
}

export interface SubscriptionPlan {
  id: string;

  uuid: string;

  name: string;

  code: string;

  description?: string;

  planType: PlanType;

  billingCycle: BillingCycle;

  price: number;

  trialDays: number;

  durationInDays?: number;

  maxUsers?: number;

  maxBranches?: number;

  maxProjects?: number;

  sortOrder: number;

  isPublic: boolean;

  status: SubscriptionStatus;

  createdAt: string;

  updatedAt: string;

  deletedAt?: string | null;

  moduleCount?: number;

  moduleIds?: string[];

  modules?: PlanModule[];
}

export interface SubscriptionPlanFormData {
  name: string;

  code: string;

  description?: string;

  planType: PlanType;

  billingCycle: BillingCycle;

  price: number;

  trialDays: number;

  durationInDays?: number;

  maxUsers?: number;

  maxBranches?: number;

  maxProjects?: number;

  sortOrder: number;

  isPublic: boolean;

  status: SubscriptionStatus;

  moduleIds: string[];
}

export interface SubscriptionPlanListResponse {
  subscriptionPlans: SubscriptionPlan[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface SubscriptionPlanResponse {
  subscriptionPlan: SubscriptionPlan;
}