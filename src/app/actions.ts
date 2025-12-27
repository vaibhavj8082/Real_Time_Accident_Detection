'use server';

import { z } from 'zod';
import {
  configureAccidentThreshold,
} from '@/ai/flows/accident-threshold-configuration';
import { summarizeAccidentDetails } from '@/ai/flows/summarize-accident-details';
import type { Incident } from './lib/types';
import twilio from 'twilio';

const settingsSchema = z.object({
  accidentConfidenceThreshold: z.coerce.number().min(0).max(1),
  motionSensitivity: z.coerce.number().min(0).max(1),
});

/**
 * Sends an emergency SMS using Twilio.
 * It reads credentials from environment variables.
 */
async function triggerEmergencySms(incidentSummary: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.SMS_TO || '999999999';

  if (!accountSid || !authToken || !fromNumber) {
    const errorMessage = 'Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not fully configured in .env file.';
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: incidentSummary,
      from: fromNumber,
      to: toNumber,
    });
    console.log(`Successfully sent SMS. Message SID: ${message.sid}`);
    return { success: true, message: `Alert was sent to ${toNumber}` };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    // Provide a more specific error if available
    if (error instanceof Error) {
       const twilioError = error as any;
       if (twilioError.code === 21211) {
         return { success: false, message: `Failed to send SMS. The 'To' number ${toNumber} is not a valid phone number.` };
       }
    }
    return { success: false, message: 'Failed to send emergency SMS.' };
  }
}


export async function handleSettingsUpdate(
  values: z.infer<typeof settingsSchema>
) {
  const validatedFields = settingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!', isError: true };
  }

  try {
    const result = await configureAccidentThreshold(validatedFields.data);
    if (result.success) {
      return { success: result.message };
    }
    return { error: 'Failed to update settings.', isError: true };
  } catch (error) {
    return { error: 'An unexpected error occurred.', isError: true };
  }
}

export async function handleVideoUpload(
  previousState: { error?: string; incident?: Incident; success?: string; isError?: boolean },
  formData: FormData
): Promise<{ error?: string; incident?: Incident; success?: string; isError?: boolean }> {
  const videoFile = formData.get('video');
  
  // This is used to reset the state from the client
  if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
    return {};
  }

  const thumbnail = formData.get('thumbnail') as string;

  if (!thumbnail) {
    return { error: 'Could not generate video thumbnail. Please try again with a different video.', isError: true };
  }

  // Simulate video processing and AI analysis
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate accident detection
  const isAccidentDetected = Math.random() > 0.05; // 95% chance of detection for demo

  if (!isAccidentDetected) {
    return { success: 'Analysis complete: No accident was detected.' };
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
    const incidentSummary = `Accident Alert! Detected at ${accidentTime.toLocaleTimeString()}. Location: Uploaded Video. Accuracy: ${Math.round(summaryResult.accuracy * 100)}%.`;

    // Trigger emergency alert
    const smsResult = await triggerEmergencySms(incidentSummary);

    const newIncident: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      location: 'Uploaded Video',
      time: accidentTime.toLocaleString(),
      status: 'New',
      thumbnail: {
        url: thumbnail,
        hint: 'video snapshot',
      },
      accuracy: summaryResult.accuracy,
    };

    if (smsResult.success) {
      return { incident: newIncident, success: smsResult.message };
    } else {
      // SMS failed but we still show the incident and the error
      return { incident: newIncident, error: smsResult.message, isError: true };
    }

  } catch (error) {
    console.error('Error processing video upload:', error);
    return { error: 'An unexpected error occurred during analysis.', isError: true };
  }
}
