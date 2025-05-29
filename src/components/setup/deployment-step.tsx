"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, ExternalLink, ListChecks, Loader2 } from 'lucide-react';

export default function DeploymentStep() {
  const [deploymentOption, setDeploymentOption] = useState('auto');
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentSuccess(false);
    setProgress(0);

    // Simulate deployment steps
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    // Simulate Firebase CLI detection, project creation, etc.
    // In a real app, this would involve server-side logic or client-side Firebase SDK usage.

    setDeploymentSuccess(true);
    setIsDeploying(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Step 4: Firebase Deployment (Simulated)</h2>
      <p className="text-muted-foreground">
        Deploy your SecureSheet Vision application to Firebase Hosting.
      </p>

      <RadioGroup value={deploymentOption} onValueChange={setDeploymentOption} className="space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auto" id="autoDeploy" />
          <Label htmlFor="autoDeploy">Automated Deployment (Recommended)</Label>
        </div>
        <p className="pl-6 text-sm text-muted-foreground">
          One-click script to handle Firebase CLI detection, project creation, and deployment.
        </p>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manualDeploy" />
          <Label htmlFor="manualDeploy">Manual Deployment</Label>
        </div>
         <p className="pl-6 text-sm text-muted-foreground">
          Download a deployment package and follow step-by-step instructions.
        </p>
      </RadioGroup>

      {deploymentOption === 'auto' && (
        <div className="pt-4 space-y-4">
          <Button onClick={handleDeploy} disabled={isDeploying || deploymentSuccess} className="w-full sm:w-auto">
            {isDeploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {deploymentSuccess ? "Deployed Successfully" : "Start Automated Deployment"}
          </Button>
          {isDeploying && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">Deploying... {progress}%</p>
            </div>
          )}
        </div>
      )}

      {deploymentOption === 'manual' && (
        <div className="pt-4 space-y-4">
          <p className="text-muted-foreground">Manual deployment instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Download the deployment package (Button would be here).</li>
            <li>Ensure Firebase CLI is installed and you are logged in.</li>
            <li>Run <code className="bg-muted px-1 rounded-sm">firebase deploy</code> in the extracted package directory.</li>
          </ol>
          <Button variant="outline" disabled>
            <ListChecks className="mr-2 h-4 w-4" />
            View Detailed Manual Instructions (Not Implemented)
          </Button>
        </div>
      )}

      {deploymentSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700 mt-4">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-300">Deployment Successful!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            Your application is now live (simulated). Live App URL: 
            <a href="#" className="font-medium underline hover:text-green-700 dark:hover:text-green-200">
              https://your-project-name.web.app <ExternalLink className="inline-block ml-1 h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
