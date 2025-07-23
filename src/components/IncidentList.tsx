import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const incidents = [
  {
    id: 1,
    type: "Unauthorised Access",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37",
    date: "7-Jul-2025",
    resolved: false,
    thumbnail: "/placeholder-incident.jpg"
  },
  {
    id: 2,
    type: "Gun Threat",
    location: "Entrance Camera",
    time: "14:30 - 14:32",
    date: "7-Jul-2025",
    resolved: false,
    thumbnail: "/placeholder-incident.jpg"
  },
  {
    id: 3,
    type: "Suspicious Activity",
    location: "Parking Lot Camera",
    time: "14:15 - 14:20",
    date: "7-Jul-2025",
    resolved: true,
    thumbnail: "/placeholder-incident.jpg"
  }
];

export function IncidentList() {
  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);
  const resolvedIncidents = incidents.filter(incident => incident.resolved);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-800 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">
            {unresolvedIncidents.length} Unresolved Incidents
          </h2>
          {resolvedIncidents.length > 0 && (
            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
              {resolvedIncidents.length} resolved
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        {incidents.map((incident) => (
          <div 
            key={incident.id}
            className={`p-4 border-b hover:bg-gray-50 ${incident.resolved ? 'opacity-60' : ''}`}
          >
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded overflow-hidden">
                <img 
                  src={incident.thumbnail} 
                  alt={incident.type}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  {incident.resolved ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {incident.type}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {incident.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {incident.time} on {incident.date}
                </p>
              </div>
              {!incident.resolved && (
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Resolve <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
          View All Incidents
        </button>
      </div>
    </div>
  );
}
