export interface OnboardingProfile {
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  career: string;
  semester: string;
  birthCity: string;
  budget?: number;
  lifestyle: {
    cleaningFrequency: string;
    isEarlyBird: boolean;
    useCommonAreasAtNight: boolean;
    sharedTasks: string[];
  };
  social: {
    hobbies: string[];
    musicGenres: string[];
    petPreference: string;
    smokingPreference: string;
    socialLevel: string;
  };
  financial: {
    budgetRange: {
      min: number;
      max: number;
    };
    roomType: string;
    preferredCommonAreas: string[];
    expenseManagement: string;
    sharedItems: string[];
  };
}