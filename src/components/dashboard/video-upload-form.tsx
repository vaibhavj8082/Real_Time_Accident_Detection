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
import { Upload, Loader2, PartyPopper, AlertCircle, Info } from 'lucide-react';
import { IncidentCard } from './incident-card';
import type { Incident } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialState: {
  error?: string;
  incident?: Incident;
  success?: string;
  isError?: boolean;
} = {};

function SubmitButton({
  isPending,
  disabled,
}: {
  isPending: boolean;
  disabled: boolean;
}) {
  return (
    <Button type="submit" className="w-full" disabled={isPending || disabled}>
      {isPending ? (
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
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const resetFormState = () => {
    setFile(null);
    setFilePreview(null);
    setThumbnail('');
    if (formRef.current) {
      formRef.current.reset();
    }
    // By passing an empty form data, we trigger the action with no file,
    // which resets the action's internal state.
    formAction(new FormData());
  };

  const generateVideoThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.onloadeddata = () => {
        video.currentTime = 1; // Seek to 1 second to get a frame
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
          reject(new Error('Could not get canvas context.'));
        }
        URL.revokeObjectURL(video.src);
      };
      video.onerror = (e) => {
        reject(new Error('Failed to load video for thumbnail generation.'));
        URL.revokeObjectURL(video.src);
      };
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    resetFormState();
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setIsGeneratingThumbnail(true);
      try {
        const thumb = await generateVideoThumbnail(selectedFile);
        setThumbnail(thumb);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Thumbnail Generation Failed',
          description:
            (error as Error).message ||
            'Could not generate a preview. Please try another video.',
        });
      } finally {
        setIsGeneratingThumbnail(false);
      }
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (state.success && state.incident) {
      toast({
        title: 'Accident Detected!',
        description: state.success,
      });
      // Play sound on accident detection
      audioRef.current?.play().catch(error => console.error("Audio playback failed:", error));
    } else if (state.success) {
      // No incident, just a success message
      toast({
        title: 'Analysis Complete',
        description: state.success,
      });
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: state.error,
      });
    }
  }, [state, isPending, toast]);

  const showResults =
    !isPending && (state.incident || state.success || state.error);

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
              required
            />
            <input type="hidden" name="thumbnail" value={thumbnail} />
          </div>

          {filePreview && !showResults && (
            <div>
              <video src={filePreview} controls className="w-full rounded-md" />
            </div>
          )}

          <SubmitButton
            isPending={isPending}
            disabled={!file || isGeneratingThumbnail}
          />
        </form>

        {showResults && (
          <div className="space-y-4 pt-4">
            {state.incident && (
              <>
                <Alert
                  variant="default"
                  className="border-green-300 bg-green-100 dark:border-green-800 dark:bg-green-950"
                >
                  <PartyPopper className="h-4 w-4 text-green-700 dark:text-green-300" />
                  <AlertTitle className="font-semibold text-green-800 dark:text-green-300">
                    Accident Detected!
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {state.success || 'An incident has been logged.'}
                  </AlertDescription>
                </Alert>
                <h3 className="text-lg font-medium">
                  Detected Incident Details:
                </h3>
                <IncidentCard incident={state.incident} />
              </>
            )}
            {!state.incident && state.success && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Analysis Report</AlertTitle>
                <AlertDescription>{state.success}</AlertDescription>
              </Alert>
            )}
            {state.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Report</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <Button
              variant="outline"
              onClick={resetFormState}
              className="w-full"
            >
              Upload Another Video
            </Button>
          </div>
        )}
      </CardContent>
      {/* Audio element for the alarm sound */}
      <audio ref={audioRef} src="https://www.w3schools.com/html/horse.ogg" className="hidden" />
    </Card>
  );
}
