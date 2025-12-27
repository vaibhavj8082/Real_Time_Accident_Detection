'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video, MapPin } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export function RtspForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate adding the stream
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Stream Added',
        description: 'The new RTSP stream is now being monitored.',
      });
      (event.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Stream</CardTitle>
        <CardDescription>
          Enter the details for a new RTSP stream to monitor.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stream-name">Stream Name</Label>
            <Input
              id="stream-name"
              placeholder="e.g., CAM-03"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-location">Location</Label>
            <Input
              id="stream-location"
              placeholder="e.g., North Entrance"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rtsp-url">RTSP URL</Label>
            <Input
              id="rtsp-url"
              placeholder="rtsp://user:pass@host:port/path"
              type="url"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Video className="mr-2 h-4 w-4" />
            {isLoading ? 'Adding Stream...' : 'Add Stream'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}