"use client";

import { Progress } from '@/components/ui/progress';

interface SetupProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  "Welcome",
  "Sheets Config",
  "Branding",
  "Deployment",
  "Share & Launch"
];

export default function SetupProgressBar({ currentStep, totalSteps }: SetupProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium text-muted-foreground">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{stepNames[currentStep-1] || ''}</span>
      </div>
      <Progress value={progressPercentage} className="w-full h-2" />
    </div>
  );
}
