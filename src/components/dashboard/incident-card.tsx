import Image from 'next/image';
import type { Incident } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Activity, Clock, MapPin } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

type IncidentCardProps = {
  incident: Incident;
};

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden animate-new-item-in">
       <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{incident.id}</CardTitle>
            <CardDescription className='flex items-center gap-1.5 pt-1'>
              <MapPin className="h-3.5 w-3.5" />
              {incident.location}
            </CardDescription>
          </div>
           <Badge variant={incident.status === 'New' ? 'destructive' : 'secondary'}>{incident.status}</Badge>
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
              <Progress value={incident.accuracy * 100} className="h-2 w-24" />
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {(incident.accuracy * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{incident.time}</span>
          </div>
      </CardFooter>
    </Card>
  );
}