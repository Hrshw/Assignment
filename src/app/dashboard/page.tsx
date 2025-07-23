import { Navbar } from "@/components/navbar";
import { CameraFeed } from "@/components/camera-feed";
import { IncidentList } from "@/components/incident-list";
import { Timeline } from "@/components/timeline";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col p-4 gap-4">
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex-1 bg-muted/20 rounded-lg overflow-hidden">
                <CameraFeed />
              </div>
              <div className="grid grid-cols-2 gap-4 h-40">
                <div className="bg-muted/20 rounded-lg p-2">
                  <div className="w-full h-full bg-black rounded-md flex items-center justify-center text-sm text-muted-foreground">
                    Camera - 02
                  </div>
                </div>
                <div className="bg-muted/20 rounded-lg p-2">
                  <div className="w-full h-full bg-black rounded-md flex items-center justify-center text-sm text-muted-foreground">
                    Camera - 03
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 bg-muted/20 rounded-lg overflow-hidden">
              <IncidentList />
            </div>
          </div>
          <div className="bg-muted/20 rounded-lg">
            <Timeline />
          </div>
        </main>
      </div>
    </div>
  );
}
