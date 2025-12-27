'use server';
/**
 * @fileOverview Generates a brief summary of accident details after detection.
 *
 * - summarizeAccidentDetails - A function that generates the accident summary.
 * - SummarizeAccidentDetailsInput - The input type for the summarizeAccidentDetails function.
 * - SummarizeAccidentDetailsOutput - The return type for the summarizeAccidentDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAccidentDetailsInputSchema = z.object({
  time: z.string().describe('The time the accident occurred.'),
  location: z.string().optional().describe('The location of the accident, if available.'),
  description: z.string().describe('A detailed description of the events leading up to the accident.'),
});
export type SummarizeAccidentDetailsInput = z.infer<typeof SummarizeAccidentDetailsInputSchema>;

const SummarizeAccidentDetailsOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the accident details.'),
});
export type SummarizeAccidentDetailsOutput = z.infer<typeof SummarizeAccidentDetailsOutputSchema>;

export async function summarizeAccidentDetails(input: SummarizeAccidentDetailsInput): Promise<SummarizeAccidentDetailsOutput> {
  return summarizeAccidentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAccidentDetailsPrompt',
  input: {schema: SummarizeAccidentDetailsInputSchema},
  output: {schema: SummarizeAccidentDetailsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing accident details.

  Create a concise summary of the accident, including the time it occurred, the location (if available), and a brief description of the events leading up to the accident.

  Time: {{{time}}}
  Location: {{{location}}}
  Description: {{{description}}}

  Summary:`,
});

const summarizeAccidentDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeAccidentDetailsFlow',
    inputSchema: SummarizeAccidentDetailsInputSchema,
    outputSchema: SummarizeAccidentDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
