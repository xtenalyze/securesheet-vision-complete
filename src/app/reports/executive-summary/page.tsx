"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateExecutiveSummaryAction } from '@/app/actions/generate-summary-action'; // Server action

export default function ExecutiveSummaryPage() {
  const [incidentData, setIncidentData] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSummary('');

    if (!incidentData.trim()) {
      toast({
        title: 'Input Error',
        description: 'Please provide incident data in JSON format.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Validate if incidentData is valid JSON
      JSON.parse(incidentData);
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'The incident data provided is not valid JSON. Please correct it and try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await generateExecutiveSummaryAction({ incidentData });
      if (result.summary) {
        setSummary(result.summary);
        toast({
          title: 'Summary Generated',
          description: 'Executive summary created successfully.',
        });
      } else {
        // Handle cases where summary might be empty or result indicates an error not caught by try/catch
        throw new Error(result.error || "Failed to generate summary for an unknown reason.");
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error Generating Summary',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleJson = JSON.stringify([
    { "incident_id": "INC001", "date": "2024-07-28", "type": "Theft", "severity": 8, "description": "Equipment stolen from Site A.", "status": "Open" },
    { "incident_id": "INC002", "date": "2024-07-29", "type": "Vandalism", "severity": 5, "description": "Graffiti on Warehouse B wall.", "status": "Investigating" }
  ], null, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" />
          Executive Summary Generator
        </h1>
        <Button variant="outline" onClick={() => setIncidentData(sampleJson)} disabled={isLoading}>
          Load Sample Data
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Use the AI-powered assistant to generate a concise executive summary from your incident data. 
        Paste your incident data in JSON format below.
      </p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Incident Data Input</CardTitle>
            <CardDescription>
              Provide a JSON array of incident objects. Ensure the JSON is well-formed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="incidentData">JSON Incident Data</Label>
              <Textarea
                id="incidentData"
                placeholder="Paste your JSON data here..."
                rows={10}
                value={incidentData}
                onChange={(e) => setIncidentData(e.target.value)}
                disabled={isLoading}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !incidentData.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
          </CardFooter>
        </Card>
      </form>

      {summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none p-4 bg-muted/50 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
