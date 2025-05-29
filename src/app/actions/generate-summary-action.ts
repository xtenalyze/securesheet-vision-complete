"use server";

import { generateExecutiveSummary, type GenerateExecutiveSummaryInput, type GenerateExecutiveSummaryOutput } from '@/ai/flows/executive-summary-flow';

interface ActionResult {
  summary?: string;
  error?: string;
}

export async function generateExecutiveSummaryAction(
  input: GenerateExecutiveSummaryInput
): Promise<ActionResult> {
  try {
    // Basic input validation (more can be added)
    if (!input.incidentData || typeof input.incidentData !== 'string') {
      return { error: "Incident data must be a non-empty string." };
    }
    try {
      JSON.parse(input.incidentData);
    } catch (e) {
      return { error: "Incident data is not valid JSON." };
    }

    const output: GenerateExecutiveSummaryOutput = await generateExecutiveSummary(input);
    
    if (output && output.summary) {
      return { summary: output.summary };
    } else {
      return { error: "AI model did not return a summary." };
    }
  } catch (error: any) {
    console.error("Error in generateExecutiveSummaryAction:", error);
    return { error: error.message || "An unexpected error occurred while generating the summary." };
  }
}
