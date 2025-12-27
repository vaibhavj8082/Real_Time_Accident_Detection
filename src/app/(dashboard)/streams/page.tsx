import { RtspForm } from '@/components/dashboard/rtsp-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Video, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function StreamsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <RtspForm />
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Streams</h2>
            <p className="text-muted-foreground">
              Monitoring the following live video feeds for incidents.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">CAM-01</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      Highway 99
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                      <AlertTriangle className="h-5 w-5 animate-pulse" />
                      ACCIDENT
                    </div>
                     <p className="text-xs text-muted-foreground">
                      15:30:12
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video overflow-hidden rounded-md border-2 border-destructive shadow-lg">
                  <Image
                    src="https://picsum.photos/seed/stream1/800/450"
                    alt="Live stream of Highway 99"
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                    data-ai-hint="highway traffic"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
             <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">CAM-02</CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-1 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      Downtown Crossing
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-500">
                    <Video className="h-5 w-5" />
                    Monitoring
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video overflow-hidden rounded-md">
                   <Image
                    src="https://picsum.photos/seed/stream2/800/450"
                    alt="Live stream of Downtown Crossing"
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                    data-ai-hint="city intersection"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
