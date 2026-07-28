export interface CompanyFormData {
  name: string;
  code: string;
  email: string;
  mobile: string;
  logo: string;
}

export interface SubscriptionFormData {
  subscriptionPlanId: number;
}

export interface CompanyAdminFormData {
  displayName: string;
  email: string;
  mobile: string;
}

export interface CreateOnboardingDto {
  company: CompanyFormData;

  subscription: SubscriptionFormData;

  admin: CompanyAdminFormData;
}