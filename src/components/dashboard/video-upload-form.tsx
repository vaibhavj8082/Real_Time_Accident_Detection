'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleVideoUpload } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, XCircle, Loader2 } from 'lucide-react';
import { IncidentCard } from './incident-card';
import type { Incident } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState: { error?: string; incident?: Incident } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Analyze Video
        </>
      )}
    </Button>
  );
}

export function VideoUploadForm() {
  const [state, formAction] = useFormState(handleVideoUpload, initialState);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('video/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    } else {
      setFileName('');
      setFilePreview(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video File</CardTitle>
        <CardDescription>
          Select a video file from your device for accident analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="video-upload"
              className="block text-sm font-medium text-foreground"
            >
              Video File
            </label>
            <Input
              id="video-upload"
              name="video"
              type="file"
              accept="video/mp4,video/avi,video/mov"
              onChange={handleFileChange}
              required
            />
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state?.error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.incident && (
          <div className="space-y-4">
             <Alert variant="default" className="bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800">
              <AlertTitle className="font-semibold text-green-800 dark:text-green-300">Analysis Complete</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                An accident was detected and an alert has been sent.
              </AlertDescription>
            </Alert>
            <h3 className="text-lg font-medium">Detected Incident:</h3>
            <IncidentCard incident={state.incident} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
