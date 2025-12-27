import Image from 'next/image';
import type { Incident } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Activity, Clock, MapPin, Eye } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type IncidentCardProps = {
  incident: Incident;
};

export function IncidentCard({ incident }: IncidentCardProps) {
  const accuracyValue = incident.accuracy * 100;

  let accuracyColor = 'bg-emerald-500';
  if (accuracyValue < 90) accuracyColor = 'bg-yellow-500';
  if (accuracyValue < 75) accuracyColor = 'bg-orange-500';

  return (
    <Dialog>
      <Card className="flex flex-col overflow-hidden animate-new-item-in transition-shadow hover:shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle>{incident.id}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 pt-1">
                <MapPin className="h-3.5 w-3.5" />
                {incident.location}
              </CardDescription>
            </div>
            <Badge
              variant={incident.status === 'New' ? 'destructive' : 'secondary'}
            >
              {incident.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="aspect-video overflow-hidden rounded-md border">
            <Image
              src={incident.thumbnail.url}
              alt={`Incident at ${incident.location}`}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              data-ai-hint={incident.thumbnail.hint}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Detection Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={accuracyValue}
                  className="h-2 w-24"
                  indicatorClassName={accuracyColor}
                />
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {accuracyValue.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{incident.time}</span>
          </div>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Incident Details: {incident.id}</DialogTitle>
          <DialogDescription>
            Detailed information about the detected incident.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="aspect-video overflow-hidden rounded-lg border">
            <Image
              src={incident.thumbnail.url}
              alt={`Incident at ${incident.location}`}
              width={600}
              height={450}
              className="h-full w-full object-cover"
              data-ai-hint={incident.thumbnail.hint}
            />
          </div>
          <div className="grid gap-4 rounded-md border p-4">
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <Badge
                variant={incident.status === 'New' ? 'destructive' : 'secondary'}
              >
                {incident.status}
              </Badge>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Location
              </span>
              <span className="text-sm font-semibold">{incident.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Time
              </span>
              <span className="text-sm font-semibold">{incident.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Detection Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={accuracyValue}
                  className="h-2 w-24"
                  indicatorClassName={accuracyColor}
                />
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {accuracyValue.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
