export interface IdentityProfileErrors {
  name?: string;
  email?: string;
  password?: string;
  age?: string;
  gender?: string;
  career?: string;
  semester?: string;
  birthCity?: string;
}

export interface LifestyleValidationErrors {
  cleaningFrequency?: string;
}

export interface SocialValidationErrors {
  hobbies?: string;
  musicGenres?: string;
  petPreference?: string;
  smokingPreference?: string;
  socialLevel?: string;
}

export interface FinancialValidationErrors {
  roomType?: string;
  expenseManagement?: string;
  sharedItems?: string;
}