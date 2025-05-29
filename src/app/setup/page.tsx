"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import WelcomeStep from '@/components/setup/welcome-step';
import SheetsConfigStep from '@/components/setup/sheets-config-step';
import BrandingStep from '@/components/setup/branding-step';
import DeploymentStep from '@/components/setup/deployment-step';
import SharingStep from '@/components/setup/sharing-step';
import SetupProgressBar from '@/components/setup/setup-progress-bar';
import { useAppContext } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 5;

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { setIsSetupComplete, brandingConfig, setBrandingConfig, spreadsheetId, apiKey } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleCompleteSetup = () => {
    // Final validation before completing setup
    if (!spreadsheetId || !apiKey) {
      toast({
        title: "Configuration Incomplete",
        description: "Please ensure Google Sheets ID and API Key are provided in Step 2.",
        variant: "destructive",
      });
      setCurrentStep(2); // Go back to sheets config step
      return;
    }
    if (!brandingConfig.companyName) {
       toast({
        title: "Branding Incomplete",
        description: "Please ensure Company Name is provided in Step 3.",
        variant: "destructive",
      });
      setCurrentStep(3); // Go back to branding step
      return;
    }

    setIsSetupComplete(true);
    toast({
      title: "Setup Complete!",
      description: "SecureSheet Vision is now configured. Redirecting to dashboard...",
    });
    router.push('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return <SheetsConfigStep />;
      case 3:
        return <BrandingStep />;
      case 4:
        return <DeploymentStep />;
      case 5:
        return <SharingStep />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <SetupProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <div className="min-h-[300px]">
        {renderStepContent()}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Previous
        </Button>
        {currentStep < TOTAL_STEPS ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={handleCompleteSetup} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Finish Setup
          </Button>
        )}
      </div>
    </div>
  );
}
