export type Incident = {
  id: string;
  location: string;
  time: string;
  status: 'Ongoing' | 'Resolved' | 'New';
  summary: string;
  thumbnail: {
    url: string;
    hint: string;
  };
  accuracy: number;
  severity: 'Minor' | 'Moderate' | 'Major';
};
