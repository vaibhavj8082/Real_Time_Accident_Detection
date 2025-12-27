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
import { AlertTriangle, PhoneOutgoing } from 'lucide-react';

type IncidentCardProps = {
  incident: Incident;
};

const statusColors = {
  New: 'bg-accent text-accent-foreground',
  Ongoing: 'bg-blue-500 text-white',
  Resolved: 'bg-green-500 text-white',
};

export function IncidentCard({ incident }: IncidentCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden animate-new-item-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
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
