import { VideoUploadForm } from '@/components/dashboard/video-upload-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Video Analysis</AlertTitle>
        <AlertDescription>
          Upload a video file to have it analyzed by our AI for potential
          accidents. Supported formats include MP4, AVI, and MOV.
        </AlertDescription>
      </Alert>

      <VideoUploadForm />
    </div>
  );
}
