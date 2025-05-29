"use client";

import { Button } from '@/components/ui/button';
import { ListChecks, PlayCircle } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Welcome to SecureSheet Vision!</h2>
      <p className="text-muted-foreground">
        This wizard will guide you through setting up your professional security incident management system. 
        The process typically takes about 10 minutes.
      </p>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Setup Overview:</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Configure Google Sheets integration</li>
          <li>Customize branding and appearance</li>
          <li>Deploy to Firebase Hosting (simulated)</li>
          <li>Share access with your team</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-primary" />
          Prerequisites:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>A Google Account</li>
          <li>Ability to create a Google Sheet and a Google Cloud Project API Key</li>
          <li>(Optional) A Firebase account for actual deployment</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Detailed instructions will be provided for each step.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button onClick={onNext} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          Start Setup
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" disabled>
          <PlayCircle className="mr-2 h-4 w-4" />
          Access Demo System (Coming Soon)
        </Button>
      </div>
    </div>
  );
}
