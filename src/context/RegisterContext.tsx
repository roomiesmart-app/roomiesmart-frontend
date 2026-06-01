import React, { createContext, useContext, useState } from "react";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  career: string;
  semester: string;
  birthCity: string;

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

interface RegisterContextType {
  formData: RegisterFormData;

  updateFormData: (
    data: Partial<RegisterFormData>
  ) => void;
}

const initialState: RegisterFormData = {
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
    socialLevel: "",
  },

  financial: {
    budgetRange: {
      min: 150,
      max: 200,
    },
    roomType: "",
    preferredCommonAreas: [],
    expenseManagement: "",
    sharedItems: [],
  },
};

const RegisterContext = createContext<
  RegisterContextType | undefined
>(undefined);

export function RegisterProvider({
  children,
}: {
  children: React.ReactNode; // <--- Cambiado a React.ReactNode
}) {
  const [formData, setFormData] =
    useState<RegisterFormData>(initialState);

  const updateFormData = (
    data: Partial<RegisterFormData>
  ) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <RegisterContext.Provider
      value={{
        formData,
        updateFormData,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export function useRegister() {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error(
      "useRegister must be used inside RegisterProvider"
    );
  }

  return context;
}