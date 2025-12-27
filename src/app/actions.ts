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
 * Sends an emergency SMS to a predefined number using Twilio.
 * It reads credentials from environment variables.
 */
async function triggerEmergencySms(incidentSummary: string) {
  const toPhoneNumber = '9307187326';
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!fromPhoneNumber || !accountSid || !authToken) {
    const errorMessage = 'Twilio credentials are not configured in environment variables.';
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: incidentSummary,
      from: fromPhoneNumber,
      to: `+${toPhoneNumber}`, // Assuming the number is in a format that needs a country code prefix
    });
    console.log(`Successfully sent SMS. Message SID: ${message.sid}`);
    return { success: true, message: `Emergency alert sent to ${toPhoneNumber}.` };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return { success: false, message: 'Failed to send emergency SMS via Twilio.' };
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
  // This is used to reset the state from the client
  if (!formData.has('video')) {
    return {};
  }

  const videoFile = formData.get('video');
  const thumbnail = formData.get('thumbnail') as string;

  if (!videoFile || !(videoFile instanceof File) || videoFile.size === 0) {
    return { error: 'A video file is required.', isError: true };
  }
  
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
