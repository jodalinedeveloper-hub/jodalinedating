interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator = ({ currentStep, totalSteps = 3 }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full ${
            index <= currentStep ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;