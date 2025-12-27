import Image from 'next/image';
import type { Incident } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Progress } from '../ui/progress';

type IncidentCardProps = {
  incident: Incident;
};

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden animate-new-item-in">
      <CardContent className="flex-grow space-y-4 pt-6">
        <div className="aspect-video overflow-hidden rounded-md">
          <Image
            src={incident.thumbnail.url}
            alt={`Incident at ${incident.location}`}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            data-ai-hint={incident.thumbnail.hint}
          />
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={incident.accuracy * 100} className="h-2 w-24" />
              <span className="text-sm font-semibold tabular-nums">
                {(incident.accuracy * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}