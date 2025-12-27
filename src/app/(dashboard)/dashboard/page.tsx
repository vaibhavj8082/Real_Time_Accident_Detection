'use client';

import { useState, useEffect } from 'react';
import { mockIncidents } from '@/lib/data';
import { IncidentCard } from '@/components/dashboard/incident-card';
import type { Incident } from '@/lib/types';

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

  return (
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
  );
}
