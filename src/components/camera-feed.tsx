import { Play, Pause, SkipBack, SkipForward, Maximize } from 'lucide-react';

export function CameraFeed() {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      <img src="/images/placeholder.svg" alt="Camera Feed" className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        11/7/2025 - 03:12:37
      </div>
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        Camera - 01
      </div>
      <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/50 p-1 rounded">
        <SkipBack className="h-5 w-5 text-white cursor-pointer" />
        <Play className="h-6 w-6 text-white cursor-pointer" />
        <SkipForward className="h-5 w-5 text-white cursor-pointer" />
        <span className="text-white text-xs">03:12:37 (15-Jun-2025)</span>
        <span className="text-white text-xs bg-gray-700 px-1 rounded">1x</span>
        <Maximize className="h-5 w-5 text-white cursor-pointer" />
      </div>
    </div>
  );
}
