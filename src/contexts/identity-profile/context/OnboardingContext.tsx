/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type { OnboardingProfile } from "../models/Profile";

interface OnboardingContextType {
  formData: OnboardingProfile;
  updateFormData: (data: Partial<OnboardingProfile>) => void;
}

const initialState: OnboardingProfile = {
  name: "",
  email: "",
  password: "",
  age: 0,
  gender: "",
  career: "",
  semester: "",
  birthCity: "",
  lifestyle: {
    cleaningFrequency: "",
    isEarlyBird: false,
    useCommonAreasAtNight: false,
    sharedTasks: [],
  },
  social: {
    hobbies: [],
    musicGenres: [],
    petPreference: "",
    smokingPreference: "",
    socialLevel: "Equilibrado",
  },
  financial: {
    budgetRange: { min: 150, max: 300 },
    roomType: "",
    preferredCommonAreas: [],
    expenseManagement: "",
    sharedItems: [],
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<OnboardingProfile>(initialState);

  const updateFormData = (data: Partial<OnboardingProfile>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <OnboardingContext.Provider value={{ formData, updateFormData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used inside OnboardingProvider");
  }
  return context;
}