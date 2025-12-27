import Image from 'next/image';
import type { Incident } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  Activity,
  ShieldAlert,
  ShieldCheck,
  Shield,
} from 'lucide-react';
import { Progress } from '../ui/progress';

type IncidentCardProps = {
  incident: Incident;
};

const statusColors = {
  New: 'bg-accent text-accent-foreground',
  Ongoing: 'bg-blue-500 text-white',
  Resolved: 'bg-green-500 text-white',
};

const severityConfig = {
  Major: {
    icon: ShieldAlert,
    color: 'text-destructive',
    label: 'Major',
  },
  Moderate: {
    icon: Shield,
    color: 'text-yellow-500',
    label: 'Moderate',
  },
  Minor: {
    icon: ShieldCheck,
    color: 'text-green-600',
    label: 'Minor',
  },
};

export function IncidentCard({ incident }: IncidentCardProps) {
  const { icon: SeverityIcon, color: severityColor, label: severityLabel } =
    severityConfig[incident.severity] || severityConfig.Moderate;

  return (
    <Card className="flex flex-col overflow-hidden animate-new-item-in">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span>{incident.location}</span>
          <Badge
            className={cn(
              'whitespace-nowrap',
              statusColors[incident.status] || 'bg-gray-500 text-white'
            )}
            variant="default"
          >
            {incident.status}
          </Badge>
        </CardTitle>
        <CardDescription>{incident.time}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
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
        <p className="text-sm text-muted-foreground">{incident.summary}</p>
        
        <div className="space-y-4">
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SeverityIcon className={cn('h-5 w-5', severityColor)} />
              <span className="text-sm font-medium">Severity</span>
            </div>
            <span className={cn('text-sm font-semibold', severityColor)}>
              {severityLabel}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="destructive">
          <AlertTriangle className="mr-2 h-4 w-4" />
          View Details & Respond
        </Button>
      </CardFooter>
    </Card>
  );
}
