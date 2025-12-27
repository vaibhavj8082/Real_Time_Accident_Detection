'use server';

import { z } from 'zod';
import {
  configureAccidentThreshold,
} from '@/ai/flows/accident-threshold-configuration';
import { summarizeAccidentDetails } from '@/ai/flows/summarize-accident-details';
import type { Incident } from './lib/types';
import nodemailer from 'nodemailer';

const settingsSchema = z.object({
  accidentConfidenceThreshold: z.coerce.number().min(0).max(1),
  motionSensitivity: z.coerce.number().min(0).max(1),
});

/**
 * Sends an emergency email using Nodemailer.
 * It reads SMTP credentials from environment variables.
 */
async function triggerEmergencyEmail(incidentSummary: string) {
  const toEmail = 'vaibhavj7326@gmail.com';
  const fromEmail = process.env.EMAIL_FROM;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!fromEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    const errorMessage = 'Email credentials (EMAIL_FROM, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) are not configured in .env file.';
    console.error(errorMessage);
    return { success: false, message: errorMessage };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"AlertWatch" <${fromEmail}>`,
      to: toEmail,
      subject: 'Accident Detected!',
      text: incidentSummary,
      html: `<p>${incidentSummary}</p>`,
    });
    console.log(`Successfully sent email. Message ID: ${info.messageId}`);
    return { success: true, message: `Emergency alert sent to ${toEmail}.` };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, message: 'Failed to send emergency email.' };
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
    const emailResult = await triggerEmergencyEmail(incidentSummary);

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

    if (emailResult.success) {
      return { incident: newIncident, success: emailResult.message };
    } else {
      // Email failed but we still show the incident and the error
      return { incident: newIncident, error: emailResult.message, isError: true };
    }

  } catch (error) {
    console.error('Error processing video upload:', error);
    return { error: 'An unexpected error occurred during analysis.', isError: true };
  }
}
