'use server';

/**
 * @fileOverview Allows administrators to configure the sensitivity of the accident detection AI.
 *
 * - configureAccidentThreshold - A function that handles the configuration of accident detection thresholds.
 * - ConfigureAccidentThresholdInput - The input type for the configureAccidentThreshold function.
 * - ConfigureAccidentThresholdOutput - The return type for the configureAccidentThreshold function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConfigureAccidentThresholdInputSchema = z.object({
  accidentConfidenceThreshold: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'The minimum confidence level (between 0 and 1) for an event to be considered an accident.'
    ),
  motionSensitivity: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'The sensitivity to motion (between 0 and 1) that triggers accident detection; higher values require more motion.'
    ),
});
export type ConfigureAccidentThresholdInput = z.infer<
  typeof ConfigureAccidentThresholdInputSchema
>;

const ConfigureAccidentThresholdOutputSchema = z.object({
  success: z.boolean().describe('Indicates if the threshold configuration was successful.'),
  message: z.string().describe('A message indicating the outcome of the configuration.'),
});
export type ConfigureAccidentThresholdOutput = z.infer<
  typeof ConfigureAccidentThresholdOutputSchema
>;

export async function configureAccidentThreshold(
  input: ConfigureAccidentThresholdInput
): Promise<ConfigureAccidentThresholdOutput> {
  return configureAccidentThresholdFlow(input);
}

const configureAccidentThresholdPrompt = ai.definePrompt({
  name: 'configureAccidentThresholdPrompt',
  input: {schema: ConfigureAccidentThresholdInputSchema},
  output: {schema: ConfigureAccidentThresholdOutputSchema},
  prompt: `You are an AI system that configures the sensitivity of an accident detection AI.

  Set the accidentConfidenceThreshold to {{accidentConfidenceThreshold}}.
  Set the motionSensitivity to {{motionSensitivity}}.

  Return a JSON object indicating whether the threshold configuration was successful and a message indicating the outcome.
  {
    "success": true,
    "message": "Accident detection thresholds configured successfully."
  }`,
});

const configureAccidentThresholdFlow = ai.defineFlow(
  {
    name: 'configureAccidentThresholdFlow',
    inputSchema: ConfigureAccidentThresholdInputSchema,
    outputSchema: ConfigureAccidentThresholdOutputSchema,
  },
  async input => {
    const {output} = await configureAccidentThresholdPrompt(input);
    return output!;
  }
);
