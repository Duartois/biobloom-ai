
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
  trialExpiresAt?: Date | null;
  backgroundColor?: string; // Added this field to match with the property used in the code
  needsOnboarding?: boolean; // Add this property to fix the TypeScript error
  trialActive?: boolean;
};
