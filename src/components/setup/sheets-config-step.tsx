"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, HelpCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAppContext } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';

export default function SheetsConfigStep() {
  const { spreadsheetId, setSpreadsheetId, apiKey, setApiKey } = useAppContext();
  const [localSpreadsheetId, setLocalSpreadsheetId] = useState(spreadsheetId || '');
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('idle');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (localSpreadsheetId.startsWith('valid-') && localApiKey.startsWith('valid-')) {
      setConnectionStatus('success');
      setSpreadsheetId(localSpreadsheetId);
      setApiKey(localApiKey);
      toast({ title: "Connection Successful!", description: "Google Sheets configured correctly." });
    } else {
      setConnectionStatus('error');
      toast({ title: "Connection Failed", description: "Please check your Spreadsheet ID and API Key.", variant: "destructive" });
    }
    setIsTestingConnection(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Step 2: Google Sheets Configuration</h2>
      <p className="text-muted-foreground">
        Connect SecureSheet Vision to your Google Sheets account. This will be your database.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Download className="mr-2 h-5 w-5 text-primary inline-block" /> Download & Setup Template
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-muted-foreground">
            <p>1. Download the pre-configured Google Sheets template.</p>
            <Button variant="outline" disabled>
              Download Template (Not Implemented)
            </Button>
            <p>2. Upload it to your Google Drive and open it as a Google Sheet.</p>
            <p className="text-sm">Visual guide: (Imagine an animated GIF here showing the process)</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2">
        <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
        <Input 
          id="spreadsheetId" 
          placeholder="Enter your Google Sheet ID" 
          value={localSpreadsheetId}
          onChange={(e) => setLocalSpreadsheetId(e.target.value)}
        />
        <div className="text-xs text-muted-foreground flex items-center">
          <HelpCircle className="mr-1 h-3 w-3" /> 
          Find this in your Google Sheet URL (e.g., docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit). For testing, use "valid-spreadsheet-id".
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">Google Cloud API Key</Label>
        <Input 
          id="apiKey" 
          type="password" 
          placeholder="Enter your Google Cloud API Key" 
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
        />
         <div className="text-xs text-muted-foreground flex items-center">
          <HelpCircle className="mr-1 h-3 w-3" /> 
          This key needs Google Sheets API v4 enabled. For testing, use "valid-api-key".
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <HelpCircle className="mr-2 h-5 w-5 text-primary inline-block" /> How to get an API Key?
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-muted-foreground text-sm">
            <p>1. Go to Google Cloud Console.</p>
            <p>2. Create a new project or select an existing one.</p>
            <p>3. Enable "Google Sheets API" in the API Library.</p>
            <p>4. Go to "Credentials", click "Create credentials", and choose "API key".</p>
            <p>5. Restrict the API key to only access the Google Sheets API for security.</p>
            <p className="font-semibold">Important: Keep your API key secure.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={handleTestConnection} disabled={isTestingConnection || !localSpreadsheetId || !localApiKey}>
        {isTestingConnection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Test Connection
      </Button>

      {connectionStatus === 'success' && (
        <Alert variant="default" className="bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-300">Connection Successful!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            Google Sheets is configured correctly.
          </AlertDescription>
        </Alert>
      )}
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-5 w-5" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            Please verify your Spreadsheet ID and API Key. Ensure the API key has Google Sheets API enabled and is not restricted incorrectly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
