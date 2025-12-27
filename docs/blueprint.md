# **App Name**: AlertWatch

## Core Features:

- RTSP Stream Analysis: Analyze live video streams from RTSP URLs to detect accidents in real-time.
- Video Upload Analysis: Allow users to upload video files for accident detection. The system analyzes the uploaded video for potential accidents.
- Accident Detection AI: Employ an AI model trained to identify accidents from video input. The model should accurately detect accidents with minimal false positives, and should use configurable thresholds to decide whether an event constitutes an accident.
- Emergency Alert System: Automatically alert emergency services by initiating a call to 9307187326 upon detecting an accident.
- Web Dashboard: Provide a web dashboard for administrators to monitor the system, view detected incidents, and manage RTSP streams and video uploads.
- Call notification system: Integrate with a call tool to call the authorities' phone numbers. Implement retry logic with exponential backoff in case of call failure.

## Style Guidelines:

- Primary color: Dark blue (#2E5EAA) to convey trust and reliability, which is crucial in an emergency application.
- Background color: Very light gray (#F0F4F8) for a clean, non-distracting backdrop that ensures readability and focus on critical data.
- Accent color: Bright orange (#E07A5F) for alerts and calls-to-action, immediately drawing attention to potential incidents and emergency options.
- Body and headline font: 'Inter' sans-serif font, chosen for its modern, neutral, and objective appearance which ensures legibility across the dashboard.
- Use clear and recognizable icons for system functions such as 'play', 'upload', 'alert', and 'settings', maintaining consistency with established UI conventions to enhance usability.
- Design a responsive, card-based layout that is intuitive, easy to navigate, and emphasizes important information. Critical elements such as alerts should be prominently placed.
- Implement subtle animations for newly detected events, guiding user attention without causing unnecessary distraction.