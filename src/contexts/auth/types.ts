
export type PlanType = 'free' | 'starter' | 'pro' | 'premium' | 'trial';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  profilePicture?: string;
  plan: PlanType;
  createdAt: Date;
  trialStartDate?: Date;
  trialEndDate?: Date;
};
