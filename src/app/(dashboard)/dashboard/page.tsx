'use client';

import { useState, useEffect } from 'react';
import { mockIncidents } from '@/lib/data';
import { IncidentCard } from '@/components/dashboard/incident-card';
import type { Incident } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Video } from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents as Incident[]);

  useEffect(() => {
    const handleNewIncident = (event: Event) => {
      const customEvent = event as CustomEvent<Incident>;
      setIncidents(prevIncidents => [customEvent.detail, ...prevIncidents]);
    };

    window.addEventListener('new-incident', handleNewIncident);

    return () => {
      window.removeEventListener('new-incident', handleNewIncident);
    };
  }, []);

  const totalIncidents = incidents.length;
  const newAlerts = incidents.filter(i => i.status === 'New').length;
  const activeStreams = 2; // Hardcoded for demo

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIncidents}</div>
            <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newAlerts}</div>
            <p className="text-xs text-muted-foreground">awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{activeStreams}</div>
            <p className="text-xs text-muted-foreground">currently being monitored</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Incidents</h2>
          <p className="text-muted-foreground">
            An overview of recently detected accidents.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}
