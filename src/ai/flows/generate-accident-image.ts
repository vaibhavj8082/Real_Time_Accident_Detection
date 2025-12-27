'use server';
/**
 * @fileOverview Generates an image based on an accident summary.
 *
 * This flow is not currently used but is kept for demonstration purposes.
 * The video upload now generates a thumbnail from the video itself.
 *
 * - generateAccidentImage - A function that generates an image for a given summary.
 * - GenerateAccidentImageInput - The input type for the generateAccidentImage function.
 * - GenerateAccidentImageOutput - The return type for the generateAccidentImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAccidentImageInputSchema = z.object({
  summary: z.string().describe('A summary of the accident.'),
});
export type GenerateAccidentImageInput = z.infer<
  typeof GenerateAccide-ntImageInputSchema
>;

const GenerateAccidentImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The data URI of the generated image.'),
});
export type GenerateAccidentImageOutput = z.infer<
  typeof GenerateAccidentImageOutputSchema
>;

export async function generateAccidentImage(
  input: GenerateAccidentImageInput
): Promise<GenerateAccidentImageOutput> {
  return generateAccidentImageFlow(input);
}

const generateAccidentImageFlow = ai.defineFlow(
  {
    name: 'generateAccidentImageFlow',
    inputSchema: GenerateAccidentImageInputSchema,
    outputSchema: GenerateAccidentImageOutputSchema,
  },
  async ({ summary }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a realistic image depicting the following accident scene. The image should look like it was captured from a security or traffic camera. Do not include any text or overlays on the image. Scene: ${summary}`,
    });
    return { imageUrl: media.url! };
  }
);
