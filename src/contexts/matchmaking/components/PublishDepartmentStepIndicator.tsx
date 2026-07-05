import React from "react";

interface PublishDepartmentStepIndicatorProps {
  currentStep: number;
}

const steps = [
  { label: "Info básica y fotos" },
  { label: "Ubicación y detalles" },
  { label: "Revisar y finalizar" },
];

export const PublishDepartmentStepIndicator: React.FC<
  PublishDepartmentStepIndicatorProps
> = ({ currentStep }) => (
  <div className="mb-10 grid grid-cols-3 gap-4">
    {steps.map((step, index) => {
      const isActive = currentStep === index + 1;
      const isComplete = currentStep > index + 1;

      return (
        <div key={step.label} className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
              isActive
                ? "bg-[#8C3A27] text-white"
                : isComplete
                  ? "bg-[#D8B2A3] text-white"
                  : "bg-[#F6E6DE] text-[#8C3A27]"
            }`}
          >
            {isComplete ? "✓" : index + 1}
          </div>
          <div>
            <p
              className={`text-xs font-semibold ${isActive ? "text-[#8C3A27]" : "text-gray-500"}`}
            >
              {step.label}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);
