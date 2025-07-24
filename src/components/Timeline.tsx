import { 
  Play, 
  Pause, 
  Rewind, 
  FastForward, 
  Maximize, 
  SkipBack, 
  SkipForward, 
  Crop, 
  Scissors, 
  Download, 
  Camera, 
  Share2, 
  MoreHorizontal,
  Video, 
  GripVertical 
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

interface TimelineEvent {
  time: string;
  type: string;
  color: string;
  camera: string;
  timestamp?: number; // Add timestamp in seconds for easier calculations
}

type CameraEvents = Record<string, TimelineEvent[]>;

// Helper function to convert time string to seconds
const timeToSeconds = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

const events: CameraEvents = {
  'Camera-01': [
    { type: 'Unauthorised Access', time: '01:30', color: 'orange', camera: 'Camera-01', timestamp: timeToSeconds('01:30') },
    { type: 'Face Recognised', time: '02:45', color: 'purple', camera: 'Camera-01', timestamp: timeToSeconds('02:45') },
    { type: 'Gun Threat', time: '14:45', color: 'red', camera: 'Camera-01', timestamp: timeToSeconds('14:45') },
    { type: '4 Multiple Events', time: '16:20', color: 'yellow', camera: 'Camera-01', timestamp: timeToSeconds('16:20') },
  ],
  'Camera-02': [
    { type: 'Traffic congestion', time: '08:15', color: 'green', camera: 'Camera-02', timestamp: timeToSeconds('08:15') },
    { type: 'Accident Detected', time: '12:30', color: 'red', camera: 'Camera-02', timestamp: timeToSeconds('12:30') },
  ],
  'Camera-03': [
    { type: 'Object Left', time: '09:30', color: 'blue', camera: 'Camera-03', timestamp: timeToSeconds('09:30') },
    { type: 'Object Removed', time: '10:15', color: 'blue', camera: 'Camera-03', timestamp: timeToSeconds('10:15') },
  ],
};

const colorClasses = {
  orange: 'bg-orange-500/20 text-orange-400 border border-orange-500',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500',
  red: 'bg-red-500/20 text-red-400 border border-red-500',
  teal: 'bg-teal-500/20 text-teal-400 border border-teal-500',
};

export function Timeline() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('03:12:37');
  const [currentDate] = useState('15-Jun-2025');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapToIncident, setSnapToIncident] = useState(true);
  const [videoDuration, setVideoDuration] = useState(86400); // 24h in seconds
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTime = useRef<number>(0);
  const [expandedCameras, setExpandedCameras] = useState<Record<string, boolean>>({
    'Camera-01': true,
    'Camera-02': true,
    'Camera-03': true
  });
  
  // 24 hours in minutes
  const totalMinutes = 24 * 60;
  const timelinePadding = 20; // Padding on each side of the timeline in pixels
  
  // Convert minutes to pixel position
  const minutesToPosition = useCallback((minutes: number) => {
    if (!timelineRef.current) return 0;
    const width = timelineRef.current.offsetWidth - (timelinePadding * 2);
    return (minutes / totalMinutes) * width + timelinePadding;
  }, [totalMinutes]);
  
  // Convert pixel position to minutes
  const positionToMinutes = useCallback((position: number) => {
    if (!timelineRef.current) return 0;
    const width = timelineRef.current.offsetWidth - (timelinePadding * 2);
    return ((position - timelinePadding) / width) * totalMinutes;
  }, [totalMinutes]);
  
  // Handle mouse down on scrubber
  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Define a type for the incident with minutes
  type IncidentWithMinutes = TimelineEvent & { 
    minutes: number;
    timestamp: number;
  };

  // Find the nearest incident to snap to
  const findNearestIncident = useCallback((position: number): IncidentWithMinutes | null => {
    if (!timelineRef.current) return null;
    
    const minutes = positionToMinutes(position);
    let nearestIncident: IncidentWithMinutes | null = null;
    let minDistance = Infinity;
    
    // Check all events for the closest one
    Object.entries(events).forEach(([cameraId, cameraEvents]) => {
      cameraEvents.forEach(event => {
        if (!event.timestamp) return;
        
        const eventMinutes = event.timestamp / 60; // Convert seconds to minutes
        const distance = Math.abs(eventMinutes - minutes);
        
        // If within 15 minutes and closer than previous closest
        if (distance < 15 && distance < minDistance) {
          minDistance = distance;
          nearestIncident = { 
            ...event, 
            camera: cameraId,
            minutes: eventMinutes,
            timestamp: event.timestamp
          };
        }
      });
    });
    
    return nearestIncident;
  }, [positionToMinutes]);
  
  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !timelineRef.current) return;
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    let position = e.clientX - timelineRect.left;
    
    // Constrain position within timeline bounds
    position = Math.max(timelinePadding, Math.min(position, timelineRect.width - timelinePadding));
    
    // Check if we should snap to an incident
    if (snapToIncident) {
      const nearestIncident = findNearestIncident(position);
      if (nearestIncident) {
        position = minutesToPosition(nearestIncident.minutes);
      }
    }
    
    setCurrentPosition(position);
    
    // Update current time and video time
    const minutes = positionToMinutes(position);
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    const newTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    setCurrentTime(newTime);
    
    // Update video time in seconds
    const newVideoTime = hours * 3600 + mins * 60 + secs;
    setCurrentVideoTime(newVideoTime);
  }, [isDragging, positionToMinutes, minutesToPosition, snapToIncident, findNearestIncident]);
  
  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Handle rewind button click
  const handleRewind = useCallback(() => {
    setCurrentVideoTime(prevTime => {
      const newTime = Math.max(0, prevTime - 10); // Rewind 10 seconds
      updateTimelinePosition(newTime);
      return newTime;
    });
  }, []);
  
  // Handle fast forward button click
  const handleFastForward = useCallback(() => {
    setCurrentVideoTime(prevTime => {
      const newTime = Math.min(videoDuration, prevTime + 10); // Fast forward 10 seconds
      updateTimelinePosition(newTime);
      return newTime;
    });
  }, [videoDuration]);
  
  // Update timeline position based on video time
  const updateTimelinePosition = useCallback((timeInSeconds: number) => {
    if (!timelineRef.current) return;
    
    const width = timelineRef.current.offsetWidth - (timelinePadding * 2);
    const position = Math.min(Math.max(timelinePadding, (timeInSeconds / videoDuration) * width + timelinePadding), 
                             timelineRef.current.offsetWidth - timelinePadding);
    setCurrentPosition(position);
    
    // Update current time display
    const hours = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);
    setCurrentTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    
    // Update current video time state
    setCurrentVideoTime(timeInSeconds);
  }, [videoDuration]);
  
  // Handle play/pause toggle
  const togglePlayPause = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (newIsPlaying) {
      // Start playing
      lastUpdateTime.current = performance.now();
      const update = (timestamp: number) => {
        if (!isPlaying) return;
        
        const delta = (timestamp - lastUpdateTime.current) / 1000; // in seconds
        lastUpdateTime.current = timestamp;
        
        setCurrentVideoTime(prevTime => {
          const newTime = Math.min(prevTime + delta * playbackSpeed, videoDuration);
          
          // Update timeline position
          if (timelineRef.current) {
            const width = timelineRef.current.offsetWidth - (timelinePadding * 2);
            const position = (newTime / videoDuration) * width + timelinePadding;
            setCurrentPosition(position);
          }
          
          // Update current time display
          const hours = Math.floor(newTime / 3600);
          const mins = Math.floor((newTime % 3600) / 60);
          const secs = Math.floor(newTime % 60);
          setCurrentTime(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
          
          // Stop if reached the end
          if (newTime >= videoDuration) {
            setIsPlaying(false);
          }
          
          return newTime;
        });
        
        if (isPlaying) {
          animationFrameRef.current = requestAnimationFrame(update);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      // Pause
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isPlaying, playbackSpeed, videoDuration]);
  
  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const toggleCameraExpand = (cameraId: string) => {
    setExpandedCameras(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }));
  };

  // Generate 24-hour time markers
  const timeMarkers = Array.from({ length: 25 }, (_, i) => ({
    hour: i,
    position: minutesToPosition(i * 60)
  }));

  return (
    <div className="w-full bg-[#1E293B] text-white p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Date and Time Display */}
          <div className="text-sm font-medium bg-blue-900/30 px-3 py-1.5 rounded mr-2">
            DI {currentTime} ({currentDate})
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center border-l border-gray-600 pl-2 ml-1">
            <button 
              className="p-1.5 hover:bg-gray-700/50 rounded-full"
              onClick={handleRewind}
            >
              <Rewind className="h-4 w-4" />
            </button>
            <button 
              className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full w-8 h-8 flex items-center justify-center mx-1"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>
            <button 
              className="p-1.5 hover:bg-gray-700/50 rounded-full"
              onClick={handleFastForward}
            >
              <FastForward className="h-4 w-4" />
            </button>
          </div>
          
          {/* Additional Controls */}
          <div className="flex items-center border-l border-gray-600 pl-2 ml-1">
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <SkipBack className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center border-l border-gray-600 pl-2 ml-1">
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <Crop className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <Scissors className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <Download className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center border-l border-gray-600 pl-2 ml-1">
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <Camera className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-700/50 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="bg-gray-700 text-white text-sm rounded px-2 py-1"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Maximize className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Timeline Ruler */}
      <div 
        ref={timelineRef}
        className="relative w-full h-8 bg-[#0F172A] rounded mb-2 overflow-hidden cursor-pointer"
        onClick={(e) => {
          if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const position = e.clientX - rect.left;
            setCurrentPosition(position);
          }
        }}
      >
        {/* Time markers */}
        {timeMarkers.map(({ hour, position }) => (
          <div 
            key={hour}
            className="absolute top-0 h-2 border-l border-gray-600"
            style={{ left: `${position}px` }}
          >
            <span className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
              {`${hour.toString().padStart(2, '0')}:00`}
            </span>
          </div>
        ))}
        
        {/* Current position indicator */}
        <div 
          ref={scrubberRef}
          className="absolute top-0 w-1 h-8 bg-yellow-400 cursor-grab active:cursor-grabbing z-10"
          style={{ left: `${currentPosition}px` }}
          onMouseDown={handleScrubberMouseDown}
        >
          <div className="absolute -top-4 -left-1.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <GripVertical className="h-3 w-3 text-gray-800" />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center w-full">
          <div className="w-40 text-sm font-semibold">Camera List</div>
          <div className="flex-1 relative w-full">
            <div className="grid grid-cols-12 text-xs text-gray-400 w-full">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="text-center">
                  {i * 2 < 10 ? '0' + i * 2 : i * 2}:00
                </div>
              ))}
            </div>
            <div className="absolute w-full h-px bg-gray-600 top-1/2 -translate-y-1/2"></div>
            <div 
              className="absolute h-full w-0.5 bg-yellow-400 top-0 z-10"
              style={{ left: `${currentPosition}px` }}
            >
              <div className="absolute -top-5 -translate-x-1/2 bg-yellow-400 text-black text-xs px-1 rounded">
                {currentTime}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {Object.entries(events).map(([cameraName, cameraEvents]) => (
            <div key={cameraName} className="flex items-center h-12">
              <div 
                className="w-40 flex items-center gap-2 text-sm cursor-pointer"
                onClick={() => toggleCameraExpand(cameraName)}
              >
                <Video className="h-4 w-4 text-gray-400" />
                <span className="hover:text-blue-400">{cameraName}</span>
              </div>
              {!expandedCameras[cameraName] && (
                <div className="flex-1 text-xs text-gray-400">
                  {cameraEvents.length} events
                </div>
              )}
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

