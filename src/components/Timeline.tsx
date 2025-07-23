import { Play, Pause, FastForward, Rewind, Maximize, Calendar, Clock, ChevronDown } from 'lucide-react';

const events = {
  'Camera-01': [
    { type: 'Unauthorised Access', time: '01:30', color: 'orange' },
    { type: 'Face Recognised', time: '02:45', color: 'purple' },
    { type: 'Unauthorised Access', time: '04:00', color: 'orange' },
    { type: 'Gun Threat', time: '04:15', color: 'red' },
  ],
  'Camera-02': [
    { type: 'Unauthorised Access', time: '01:00', color: 'orange' },
    { type: 'Face Recognised', time: '03:15', color: 'purple' },
  ],
  'Camera-03': [
    { type: 'Traffic congestion', time: '02:15', color: 'teal' },
    { type: 'Unauthorised Access', time: '03:45', color: 'orange' },
  ],
};

const colorClasses = {
  orange: 'bg-orange-500/20 text-orange-400 border border-orange-500',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500',
  red: 'bg-red-500/20 text-red-400 border border-red-500',
  teal: 'bg-teal-500/20 text-teal-400 border border-teal-500',
};

export function Timeline() {
  return (
    <div className="bg-[#1E293B] text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button><Rewind className="h-5 w-5" /></button>
          <button><Play className="h-5 w-5" /></button>
          <button><Pause className="h-5 w-5" /></button>
          <button><FastForward className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>DI 03:12:37 (15-Jun-2025)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>1x</span>
          <button><Maximize className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center">
          <div className="w-40 text-sm font-semibold">Camera List</div>
          <div className="flex-1 relative">
            <div className="grid grid-cols-6 text-xs text-gray-400">
              <div className="text-center">00:00</div>
              <div className="text-center">01:00</div>
              <div className="text-center">02:00</div>
              <div className="text-center">03:00</div>
              <div className="text-center">04:00</div>
              <div className="text-center">05:00</div>
            </div>
            <div className="absolute w-full h-px bg-gray-600 top-1/2 -translate-y-1/2"></div>
            <div className="absolute h-full w-0.5 bg-yellow-400 top-0" style={{ left: '54%' }}>
              <div className="absolute -top-5 -translate-x-1/2 bg-yellow-400 text-black text-xs px-1 rounded">03:12:37</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {Object.entries(events).map(([cameraName, cameraEvents]) => (
            <div key={cameraName} className="flex items-center h-12">
              <div className="w-40 flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>{cameraName}</span>
              </div>
              <div className="flex-1 h-full relative">
                {cameraEvents.map((event, index) => {
                  const [hours, minutes] = event.time.split(':').map(Number);
                  const totalMinutes = hours * 60 + minutes;
                  const leftPercentage = (totalMinutes / (5 * 60)) * 100;
                  return (
                    <div 
                      key={index}
                      className={`absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-xs whitespace-nowrap ${colorClasses[event.color]}`}
                      style={{ left: `${leftPercentage}%` }}
                    >
                      {event.type}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
}
