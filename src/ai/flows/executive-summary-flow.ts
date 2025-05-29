'use server';

/**
 * @fileOverview Generates an executive summary report of recent security incidents.
 *
 * - generateExecutiveSummary - A function that generates an executive summary report.
 * - GenerateExecutiveSummaryInput - The input type for the generateExecutiveSummary function.
 * - GenerateExecutiveSummaryOutput - The return type for the generateExecutiveSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExecutiveSummaryInputSchema = z.object({
  incidentData: z
    .string()
    .describe('A JSON string containing the recent security incident data.'),
});
export type GenerateExecutiveSummaryInput = z.infer<
  typeof GenerateExecutiveSummaryInputSchema
>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise and insightful summary report of recent security incidents.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<
  typeof GenerateExecutiveSummaryOutputSchema
>;

export async function generateExecutiveSummary(
  input: GenerateExecutiveSummaryInput
): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

// Reconstruct the prompt content using string concatenation
const executiveSummaryPromptContent =
  'You are an AI assistant that generates executive summaries for security incident reports.\n' +
  '\n' +
  '  Given the following incident data:\n' +
  '  ```' + // Separated ```
  'json\n' + // Separated json\n
  '  {{{incidentData}}}\n' +
  '  ```\n' +
  '\n' +
  '  Generate a concise, insightful summary report of recent security incidents, ' +
  'highlighting key trends and potential areas of concern. ' +
  'Focus on providing actionable intelligence that executives can use to make informed decisions.\n';

const prompt = ai.definePrompt({
  name: 'executiveSummaryPrompt',
  input: {schema: GenerateExecutiveSummaryInputSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: executiveSummaryPromptContent,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
