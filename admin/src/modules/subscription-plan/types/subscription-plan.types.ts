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

  uuid: string;

  name: string;

  code: string;

  icon?: string | null;

  route?: string | null;

  sortOrder: number;

  status: SubscriptionStatus;
}


export interface SubscriptionPlan {
  id: string;

  uuid: string;

  name: string;

  code: string;

  description?: string | null;

  planType: PlanType;

  billingCycle: BillingCycle;

  price: number;

  trialDays: number;

  durationInDays?: number | null;

  maxUsers?: number | null;

  maxBranches?: number | null;

  maxProjects?: number | null;

  sortOrder: number;

  isPublic: boolean;

  status: SubscriptionStatus;

  createdAt: string;

  updatedAt: string;

  deletedAt?: string | null;

  /*
   * List endpoint repository currently
   * returns Prisma _count.
   */
  _count?: {
    subscriptionPlanModules: number;
    companySubscriptions: number;
  };

  /*
   * Detail endpoint adds these.
   */
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


export interface SubscriptionPlanPagination {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}


export interface SubscriptionPlanListResponse {
  subscriptionPlans:
    SubscriptionPlan[];

  pagination:
    SubscriptionPlanPagination;
}


export interface SubscriptionPlanResponse {
  subscriptionPlan:
    SubscriptionPlan;
}