'use client';

import { useState, useActionState, useRef, useEffect, startTransition } from 'react';
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
} = {};

export function VideoUploadForm() {
  const [state, formAction, isPending] = useActionState(
    handleVideoUpload,
    initialState
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset state when a new file is selected
    if (state.incident || state.error || state.success) {
      startTransition(() => {
        formAction(new FormData()); // Resets server action state
      });
    }
    setVideoFile(null);
    setVideoPreview(null);
    setThumbnail('');

    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      setIsGeneratingThumbnail(true);
      try {
        const thumb = await generateVideoThumbnail(file);
        setThumbnail(thumb);
      } catch (error) {
        console.error('Thumbnail generation failed:', error);
        toast({
          variant: 'destructive',
          title: 'Thumbnail Failed',
          description: 'Could not generate a video preview. Please try a different video.',
        });
      } finally {
        setIsGeneratingThumbnail(false);
      }
    }
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;

      video.onloadeddata = () => {
        video.currentTime = 1; // Seek to 1 second
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
          reject(new Error('Canvas context is not available.'));
        }
        URL.revokeObjectURL(videoUrl);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail.'));
        URL.revokeObjectURL(videoUrl);
      };
    });
  };

  useEffect(() => {
    if (!isPending && state.incident) {
      audioRef.current?.play().catch(e => console.error("Audio playback failed", e));
      toast({
        title: 'Accident Detected!',
        description: state.success || 'An incident has been logged and an alert was sent.',
      });
    } else if (!isPending && state.success) {
        toast({
            title: 'Analysis Complete',
            description: state.success,
        });
    } else if (!isPending && state.error) {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: state.error,
        });
    }
  }, [state, isPending, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!videoFile || !thumbnail) return;

    const formData = new FormData(event.currentTarget);
    formData.set('video', videoFile);
    formData.set('thumbnail', thumbnail);
    formAction(formData);
  };

  const handleReset = () => {
    startTransition(() => {
      formAction(new FormData()); // Resets server action state
    });
    setVideoFile(null);
    setVideoPreview(null);
    setThumbnail('');
    formRef.current?.reset();
  }

  const showResults = !isPending && (state.incident || state.success || state.error);
  const isSubmitDisabled = isPending || isGeneratingThumbnail || !videoFile || !thumbnail;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video File</CardTitle>
        <CardDescription>
          Select a video file from your device for accident analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showResults ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                accept="video/mp4,video/avi,video/mov,video/webm"
                onChange={handleFileChange}
                disabled={isPending}
                required
              />
            </div>
             
            {videoPreview && (
              <div>
                <video src={videoPreview} controls className="w-full rounded-md" />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : isGeneratingThumbnail ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Video...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Video
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 pt-4">
            {state.incident && (
              <>
                <Alert
                  variant="default"
                  className="border-destructive bg-destructive/10"
                >
                  <PartyPopper className="h-4 w-4 text-destructive" />
                  <AlertTitle className="font-semibold text-destructive">
                    Accident Detected!
                  </AlertTitle>
                  <AlertDescription className="text-destructive/90">
                    {state.success || 'An incident has been logged and an alert sent.'}
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
            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Report</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full"
            >
              Upload Another Video
            </Button>
          </div>
        )}
      </CardContent>
      <audio ref={audioRef} src="/alarm.mp3" className="hidden" preload="auto" />
    </Card>
  );
}
