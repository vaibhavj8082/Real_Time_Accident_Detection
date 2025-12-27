'use server';

import { z } from 'zod';
import {
  configureAccidentThreshold,
} from '@/ai/flows/accident-threshold-configuration';
import { summarizeAccidentDetails } from '@/ai/flows/summarize-accident-details';
import type { Incident } from './lib/types';

const settingsSchema = z.object({
  accidentConfidenceThreshold: z.coerce.number().min(0).max(1),
  motionSensitivity: z.coerce.number().min(0).max(1),
});

/**
 * Simulates triggering an emergency call to a predefined number.
 * In a real application, this would integrate with a telephony API like Twilio.
 * Includes retry logic with exponential backoff in case of call failure.
 */
async function triggerEmergencyCall(incidentSummary: string) {
  const emergencyNumber = '9307187326';
  console.log(`Initiating emergency call to ${emergencyNumber}...`);
  console.log(`Incident Details: ${incidentSummary}`);

  let attempts = 0;
  const maxAttempts = 3;
  let delay = 1000; // 1 second initial delay

  while (attempts < maxAttempts) {
    try {
      // Simulate API call to a telephony service
      const success = await new Promise<boolean>((resolve) =>
        setTimeout(() => {
          // Flip this to false to test retry logic
          resolve(true);
        }, 1000)
      );

      if (success) {
        console.log(`Successfully initiated call to ${emergencyNumber}.`);
        return { success: true, message: `Call initiated to ${emergencyNumber}.` };
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
    }

    attempts++;
    if (attempts < maxAttempts) {
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  console.error(`Failed to initiate call to ${emergencyNumber} after ${maxAttempts} attempts.`);
  return { success: false, message: `Failed to initiate call to ${emergencyNumber}.` };
}

export async function handleSettingsUpdate(
  values: z.infer<typeof settingsSchema>
) {
  const validatedFields = settingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  try {
    const result = await configureAccidentThreshold(validatedFields.data);
    if (result.success) {
      return { success: result.message };
    }
    return { error: 'Failed to update settings.' };
  } catch (error) {
    return { error: 'An unexpected error occurred.' };
  }
}

export async function handleVideoUpload(
  previousState: { error?: string; incident?: Incident },
  formData: FormData
): Promise<{ error?: string; incident?: Incident }> {
  const videoFile = formData.get('video');
  const thumbnail = formData.get('thumbnail') as string;

  if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
    return { error: 'A video file is required.' };
  }
  
  if (!thumbnail) {
    return { error: 'Could not generate video thumbnail.' };
  }


  // Simulate video processing and AI analysis
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate accident detection
  const isAccidentDetected = Math.random() > 0.05; // 95% chance of detection for demo

  if (!isAccidentDetected) {
    return { error: 'No accident was detected in the uploaded video.' };
  }

  try {
    // Generate summary using GenAI
    const accidentTime = new Date();
    const summaryInput = {
      time: accidentTime.toLocaleString(),
      location: 'Uploaded Video Analysis',
      description: `An accident was detected in the video uploaded at ${accidentTime.toLocaleTimeString()}. The system has analyzed the footage and identified a critical event.`,
    };

    const summaryResult = await summarizeAccidentDetails(summaryInput);

    // Trigger emergency alert
    await triggerEmergencyCall(summaryResult.summary);

    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      location: 'Uploaded Video',
      time: accidentTime.toLocaleString(),
      status: 'New',
      summary: summaryResult.summary,
      accuracy: summaryResult.accuracy,
      severity: summaryResult.severity,
      thumbnail: {
        url: thumbnail,
        hint: 'video snapshot',
      },
    };

    return { incident: newIncident };
  } catch (error) {
    console.error('Error processing video upload:', error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}
