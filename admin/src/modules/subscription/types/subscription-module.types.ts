export interface Module {
  id: string;

  name: string;

  code: string;

  description?: string;
}

export interface AssignedModulesResponse {
  subscriptionPlanId: string;

  moduleIds: string[];
}