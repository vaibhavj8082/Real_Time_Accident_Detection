'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
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

function SubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={disabled}>
      {disabled ? (
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
  const [state, formAction, isPending] = useActionState(
    handleVideoUpload,
    initialState
  );
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isThumbnailReady, setIsThumbnailReady] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        video.currentTime = 1; // Capture frame at 1 second
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg'));
        } else {
          resolve('');
        }
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        resolve(''); // Resolve with empty string on error
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Reset state on new file selection
    setFilePreview(null);
    setFileName('');
    setIsThumbnailReady(false);
    if (thumbnailRef.current) {
      thumbnailRef.current.value = '';
    }

    if (file) {
      setFileName(file.name);
      if (file.type.startsWith('video/')) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        const thumbnailDataUrl = await generateVideoThumbnail(file);
        if (thumbnailRef.current) {
          thumbnailRef.current.value = thumbnailDataUrl;
          if (thumbnailDataUrl) {
            setIsThumbnailReady(true);
          }
        }
      }
    }
  };
  
   useEffect(() => {
    // This effect runs when the server action completes (isPending becomes false)
    // and there is a result (incident or error).
    if (!isPending && (state.incident || state.error)) {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFilePreview(null);
        setFileName('');
        setIsThumbnailReady(false);
        if (thumbnailRef.current) {
          thumbnailRef.current.value = '';
        }
    }
  }, [isPending, state.incident, state.error]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video File</CardTitle>
        <CardDescription>
          Select a video file from your device for accident analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form ref={formRef} action={formAction} className="space-y-6">
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
              disabled={isPending}
              ref={fileInputRef}
              required
            />
            {fileName && !isPending && (
              <p className="text-sm text-muted-foreground">
                Selected: {fileName}
              </p>
            )}
          </div>
          {filePreview && (
            <div>
              <video src={filePreview} controls className="w-full rounded-md" />
            </div>
          )}
          <input type="hidden" name="thumbnail" ref={thumbnailRef} />
          <SubmitButton disabled={isPending || !isThumbnailReady} />
        </form>

        {state?.error && !isPending && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.incident && !isPending && (
          <div className="space-y-4">
            <Alert
              variant="default"
              className="bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800"
            >
              <AlertTitle className="font-semibold text-green-800 dark:text-green-300">
                Analysis Complete
              </AlertTitle>
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
