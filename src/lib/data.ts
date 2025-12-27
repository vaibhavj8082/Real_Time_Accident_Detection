import type { Incident } from '@/lib/types';

export const mockIncidents: Omit<Incident, 'summary' | 'severity'>[] = [
  {
    id: 'INC-001',
    location: 'I-5 North, Exit 254',
    time: '2024-07-28 14:35:12',
    status: 'New',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident1/400/300',
      hint: 'car accident',
    },
    accuracy: 0.95,
  },
  {
    id: 'INC-002',
    location: 'Main St & 12th Ave',
    time: '2024-07-28 11:12:45',
    status: 'Resolved',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident2/400/300',
      hint: 'fender bender',
    },
    accuracy: 0.99,
  },
  {
    id: 'INC-003',
    location: 'Highway 101, Mile 89',
    time: '2024-07-27 22:50:03',
    status: 'Ongoing',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident3/400/300',
      hint: 'night crash',
    },
    accuracy: 0.92,
  },
];
