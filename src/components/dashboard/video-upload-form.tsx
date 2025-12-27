'use client';

import {
  useState,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { handleVideoUpload } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Upload,
  Loader2,
  PartyPopper,
  AlertCircle,
  Info,
  Film,
  RefreshCw,
  Video,
} from 'lucide-react';
import { IncidentCard } from './incident-card';
import type { Incident } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- State Management ---

type FormState = {
  videoFile: File | null;
  videoPreview: string | null;
  thumbnail: string;
  isGeneratingThumbnail: boolean;
  serverState: {
    error?: string;
    incident?: Incident;
    success?: string;
  };
  isPending: boolean;
};

const initialFormState: FormState = {
  videoFile: null,
  videoPreview: null,
  thumbnail: '',
  isGeneratingThumbnail: false,
  serverState: {},
  isPending: false,
};

type FormAction =
  | { type: 'SET_FILE'; payload: { file: File; previewUrl: string } }
  | { type: 'GENERATING_THUMBNAIL' }
  | { type: 'SET_THUMBNAIL'; payload: string }
  | { type: 'THUMBNAIL_ERROR' }
  | { type: 'SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: FormState['serverState'] }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FILE':
      return {
        ...initialFormState,
        videoFile: action.payload.file,
        videoPreview: action.payload.previewUrl,
      };
    case 'GENERATING_THUMBNAIL':
      return { ...state, isGeneratingThumbnail: true };
    case 'SET_THUMBNAIL':
      return { ...state, thumbnail: action.payload, isGeneratingThumbnail: false };
    case 'THUMBNAIL_ERROR':
      return { ...state, isGeneratingThumbnail: false };
    case 'SUBMIT':
      return { ...state, isPending: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, isPending: false, serverState: action.payload };
    case 'RESET':
      // Revoke old object URLs to prevent memory leaks
      if (state.videoPreview) URL.revokeObjectURL(state.videoPreview);
      return initialFormState;
    default:
      return state;
  }
}

// --- Component ---

export function VideoUploadForm() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      if (state.videoPreview) {
        URL.revokeObjectURL(state.videoPreview);
      }
    };
  }, [state.videoPreview]);

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.onloadeddata = () => {
        // Seek to 1 second or half the duration for short videos
        video.currentTime = Math.min(1, video.duration / 2);
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
          reject(new Error('Canvas context not available.'));
        }
      };
      video.onerror = (e) => {
        reject(new Error(`Failed to load video for thumbnail: ${e}`));
      };
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleFile = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    dispatch({ type: 'SET_FILE', payload: { file, previewUrl } });
    dispatch({ type: 'GENERATING_THUMBNAIL' });
    try {
      const thumb = await generateVideoThumbnail(file);
      dispatch({ type: 'SET_THUMBNAIL', payload: thumb });
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Preview Failed',
        description: 'Could not generate a video preview. Please try a different video.',
      });
      dispatch({ type: 'THUMBNAIL_ERROR' });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
       handleFile(file);
    }
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!state.videoFile || !state.thumbnail || state.isPending || state.isGeneratingThumbnail) return;

    dispatch({ type: 'SUBMIT' });

    const formData = new FormData();
    formData.append('video', state.videoFile);
    formData.append('thumbnail', state.thumbnail);

    const result = await handleVideoUpload(state.serverState, formData);
    dispatch({ type: 'SUBMIT_SUCCESS', payload: result });

    if (result.incident) {
      window.dispatchEvent(new CustomEvent('new-incident', { detail: result.incident }));
      audioRef.current?.play().catch(e => console.error("Audio playback failed", e));
      toast({
        title: 'Accident Detected!',
        description: result.success || 'An incident has been logged and an alert was sent.',
        variant: 'destructive',
      });
    } else if (result.success) {
      toast({
        title: 'Analysis Complete',
        description: result.success,
      });
    } else if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const showResults = !state.isPending && (state.serverState.incident || state.serverState.success || state.serverState.error);
  const isSubmitDisabled = state.isPending || state.isGeneratingThumbnail || !state.videoFile || !state.thumbnail;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Upload Video File</CardTitle>
        <CardDescription>
          Select or drag and drop a video file for accident analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showResults ? (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            {state.videoPreview ? (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border-2 border-dashed">
                  <video src={state.videoPreview} controls muted className="w-full aspect-video" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="video-upload" className="text-sm font-medium">Change Video</Label>
                    <Input
                      id="video-upload"
                      name="video"
                      type="file"
                      accept="video/mp4,video/avi,video/mov,video/webm"
                      onChange={handleFileChange}
                      disabled={state.isPending || state.isGeneratingThumbnail}
                      className="file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                    />
                </div>
              </div>
            ) : (
             <div 
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors hover:border-primary/50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
             >
                <Video className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Drop video here</h3>
                <p className="mt-1 text-sm text-muted-foreground">or</p>
                <Label htmlFor="video-upload" className={cn(buttonVariants({variant: "outline", className: "mt-4 cursor-pointer"}))}>
                    Select File
                </Label>
                <Input
                  id="video-upload"
                  name="video"
                  type="file"
                  accept="video/mp4,video/avi,video/mov,video/webm"
                  onChange={handleFileChange}
                  disabled={state.isPending}
                  className="sr-only"
                />
              </div>
            )}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitDisabled}>
              {state.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing Video...</>
              ) : state.isGeneratingThumbnail ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Preparing Video...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />Analyze Video</>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            {state.serverState.incident && (
              <>
                <Alert variant="destructive" className="text-left">
                  <PartyPopper className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Accident Detected!</AlertTitle>
                  <AlertDescription>
                    {state.serverState.success || 'An incident has been logged and an alert sent.'}
                  </AlertDescription>
                </Alert>
                <div className="pt-4">
                  <IncidentCard incident={state.serverState.incident} />
                </div>
              </>
            )}
            {!state.serverState.incident && state.serverState.success && (
              <Alert className="text-left">
                <Info className="h-4 w-4" />
                <AlertTitle>Analysis Report</AlertTitle>
                <AlertDescription>{state.serverState.success}</AlertDescription>
              </Alert>
            )}
            {state.serverState.error && (
              <Alert variant="destructive" className="text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{state.serverState.error}</AlertDescription>
              </Alert>
            )}
            <Button variant="outline" onClick={handleReset} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Analyze Another Video
            </Button>
          </div>
        )}
      </CardContent>
      <audio ref={audioRef} src="/alarm.mp3" className="hidden" preload="auto" />
    </Card>
  );
}
