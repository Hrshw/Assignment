"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { IncidentList } from "@/components/incident-list"
import { IncidentPlayer } from "@/components/incident-player"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type Incident = {
  id: string
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  camera: {
    id: string
    name: string
    location: string
  }
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents?resolved=false')
      if (!response.ok) {
        throw new Error('Failed to fetch incidents')
      }
      const data = await response.json()
      setIncidents(data)
      
      // Auto-select the first incident if none selected
      if (!selectedIncident && data.length > 0) {
        setSelectedIncident(data[0])
      }
      
      // Update selected incident data if it exists in the new data
      if (selectedIncident) {
        const updatedSelected = data.find((i: Incident) => i.id === selectedIncident.id)
        if (updatedSelected) {
          setSelectedIncident(updatedSelected)
        }
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching incidents:', err)
      setError('Failed to load incidents. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchIncidents, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  const handleResolveIncident = async (id: string) => {
    try {
      const response = await fetch(`/api/incidents/${id}/resolve`, {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Failed to resolve incident')
      }
      
      // Update the local state to reflect the change
      const updatedIncident = await response.json()
      
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === id ? updatedIncident : incident
        )
      )
      
      // If the resolved incident was selected, update it
      if (selectedIncident?.id === id) {
        setSelectedIncident(updatedIncident)
      }
      
      return updatedIncident
    } catch (err) {
      console.error('Error resolving incident:', err)
      throw err
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchIncidents()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Incident Dashboard</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className={cn(
            "grid gap-6",
            isFullscreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
          )}>
            <div className={cn(
              "lg:col-span-2",
              isFullscreen ? "lg:col-span-1" : ""
            )}>
              <IncidentPlayer
                incident={selectedIncident || null}
                onResolve={handleResolveIncident}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
              />
            </div>
            
            {!isFullscreen && (
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Incidents</h2>
                  <span className="text-sm text-muted-foreground">
                    {incidents.length} {incidents.length === 1 ? 'incident' : 'incidents'}
                  </span>
                </div>
                
                <div className="h-[calc(100vh-240px)] overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                    </div>
                  ) : (
                    <IncidentList
                      incidents={incidents}
                      onResolve={handleResolveIncident}
                      onSelect={setSelectedIncident}
                      selectedIncidentId={selectedIncident?.id}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
