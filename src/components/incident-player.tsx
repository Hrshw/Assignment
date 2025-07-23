"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Expand, Minimize2, AlertTriangle, Clock, Video } from "lucide-react"
import { formatDateTime, formatTimeAgo } from "@/lib/utils"
import { cn } from "@/lib/utils"

import { Incident } from "./incident-list"

interface IncidentPlayerProps {
  incident: Incident | null
  onResolve: (id: string) => Promise<void>
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
}

export function IncidentPlayer({
  incident,
  onResolve,
  isFullscreen = false,
  onToggleFullscreen,
}: IncidentPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isResolving, setIsResolving] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleResolve = async () => {
    if (!incident) return
    
    setIsResolving(true)
    try {
      await onResolve(incident.id)
    } finally {
      setIsResolving(false)
    }
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted p-8 text-center">
        <Video className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          No incident selected
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Select an incident from the list to view details
        </p>
      </div>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", isFullscreen && "fixed inset-0 z-50 m-0 rounded-none")}>
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{incident.type}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {incident.camera.location} • {incident.camera.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={incident.resolved ? "outline" : "destructive"}
              size="sm"
              onClick={handleResolve}
              disabled={isResolving || incident.resolved}
            >
              {incident.resolved ? (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-1" /> Resolved
                </span>
              ) : (
                <span>Mark as Resolved</span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="text-muted-foreground"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 bg-black relative">
        <div className="aspect-video bg-black flex items-center justify-center">
          {/* Placeholder for video player */}
          <div className="relative w-full h-full">
            <img
              src={incident.thumbnailUrl || "/images/placeholder.svg"}
              alt="Incident video feed"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
                <span className="sr-only">
                  {isPlaying ? "Pause" : "Play"}
                </span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Timeline scrubber */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/70 p-2 rounded-md">
          <div className="h-1.5 bg-white/20 rounded-full w-full mb-1">
            <div className="h-full bg-white rounded-full w-1/3" />
          </div>
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>{formatDateTime(incident.tsStart)}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(incident.tsStart)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for the check icon
interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function Check({ className, ...props }: CheckIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// Add missing imports
import { useState } from "react"
