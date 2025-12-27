export type Incident = {
  id: string;
  location: string;
  time: string;
  status: 'Ongoing' | 'Resolved' | 'New';
  thumbnail: {
    url: string;
    hint: string;
  };
  accuracy: number;
};
