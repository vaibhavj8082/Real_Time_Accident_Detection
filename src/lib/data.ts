import type { Incident } from '@/lib/types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    location: 'I-5 North, Exit 254',
    time: '2024-07-28 14:35:12',
    status: 'New',
    summary:
      'A multi-vehicle collision involving a sedan and a truck has been detected. Emergency services alerted.',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident1/400/300',
      hint: 'car accident',
    },
  },
  {
    id: 'INC-002',
    location: 'Main St & 12th Ave',
    time: '2024-07-28 11:12:45',
    status: 'Resolved',
    summary:
      'Minor fender bender between two passenger cars. No injuries reported, scene cleared.',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident2/400/300',
      hint: 'fender bender',
    },
  },
  {
    id: 'INC-003',
    location: 'Highway 101, Mile 89',
    time: '2024-07-27 22:50:03',
    status: 'Ongoing',
    summary:
      'Single vehicle rollover detected on a wet road. Authorities are on site and managing traffic.',
    thumbnail: {
      url: 'https://picsum.photos/seed/accident3/400/300',
      hint: 'night crash',
    },
  },
];
