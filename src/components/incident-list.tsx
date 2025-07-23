import { AlertTriangle, Check, ArrowRight, FileText, Plus } from "lucide-react";

const incidents = [
  {
    id: 1,
    type: "Unauthorised Access",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37 on 7-Jul-2025",
    resolved: false,
    thumbnail: "/images/placeholder.svg"
  },
  {
    id: 2,
    type: "Gun Threat",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37 on 7-Jul-2025",
    resolved: false,
    thumbnail: "/images/placeholder.svg"
  },
  {
    id: 3,
    type: "Unauthorised Access",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37 on 7-Jul-2025",
    resolved: false,
    thumbnail: "/images/placeholder.svg"
  },
  {
    id: 4,
    type: "Unauthorised Access",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37 on 7-Jul-2025",
    resolved: false,
    thumbnail: "/images/placeholder.svg"
  },
  {
    id: 5,
    type: "Unauthorised Access",
    location: "Shop Floor Camera A",
    time: "14:35 - 14:37 on 7-Jul-2025",
    resolved: false,
    thumbnail: "/images/placeholder.svg"
  },
];

export function IncidentList() {
  const unresolvedIncidents = incidents.filter(incident => !incident.resolved);
  const resolvedIncidentsCount = 4; // As per image

  return (
    <div className="bg-[#1E293B] text-white h-full flex flex-col rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {unresolvedIncidents.length} Unresolved Incidents
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <Plus className="h-4 w-4" />
              <span>%</span>
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <Check className="h-4 w-4" />
              <span>{resolvedIncidentsCount} resolved incidents</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {incidents.map((incident, index) => (
          <div 
            key={incident.id}
            className={`p-3 flex items-center gap-3 border-b border-gray-700 hover:bg-[#334155] cursor-pointer ${index === 0 ? 'border-l-2 border-green-500 bg-[#334155]' : ''}`}
          >
            <img src={incident.thumbnail} alt={incident.type} className="w-20 h-12 object-cover rounded-md" />
            <div className="flex-1">
              <div className={`flex items-center gap-2 text-sm font-semibold ${incident.type === 'Gun Threat' ? 'text-red-500' : 'text-orange-400'}`}>
                <AlertTriangle className="h-4 w-4" />
                {incident.type}
              </div>
              <p className="text-xs text-gray-400 mt-1">{incident.location}</p>
              <p className="text-xs text-gray-500 mt-1">{incident.time}</p>
            </div>
            <button className="text-yellow-400 text-sm font-semibold flex items-center gap-1">
              Resolve <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
