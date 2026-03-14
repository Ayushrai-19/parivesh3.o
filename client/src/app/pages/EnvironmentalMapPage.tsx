import { useState } from "react";
import { GovHeader } from "../components/GovHeader";
import { Map, MapPin, Trees, Bird, Waves, Factory, AlertTriangle, Info } from "lucide-react";

export function EnvironmentalMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const layers = [
    { id: "all", name: "All Layers", icon: Map, color: "gray" },
    { id: "forest", name: "Forest Areas", icon: Trees, color: "green" },
    { id: "wildlife", name: "Wildlife Sanctuaries", icon: Bird, color: "blue" },
    { id: "crz", name: "CRZ Zones", icon: Waves, color: "cyan" },
    { id: "pollution", name: "Pollution Data", icon: Factory, color: "red" },
  ];

  const zones = [
    { 
      id: "1", 
      name: "Jim Corbett National Park", 
      type: "wildlife", 
      state: "Uttarakhand",
      area: "1318.54 sq km",
      status: "Protected",
      risk: "Low"
    },
    { 
      id: "2", 
      name: "Sundarbans Reserve Forest", 
      type: "forest", 
      state: "West Bengal",
      area: "4262 sq km",
      status: "Protected",
      risk: "Medium"
    },
    { 
      id: "3", 
      name: "Mumbai Coastal Zone", 
      type: "crz", 
      state: "Maharashtra",
      area: "645 sq km",
      status: "Regulated",
      risk: "High"
    },
    { 
      id: "4", 
      name: "Delhi NCR Industrial Belt", 
      type: "pollution", 
      state: "Delhi",
      area: "1483 sq km",
      status: "Monitored",
      risk: "High"
    },
    { 
      id: "5", 
      name: "Kaziranga National Park", 
      type: "wildlife", 
      state: "Assam",
      area: "858.98 sq km",
      status: "Protected",
      risk: "Low"
    },
    { 
      id: "6", 
      name: "Western Ghats Forest", 
      type: "forest", 
      state: "Kerala",
      area: "129037 sq km",
      status: "Protected",
      risk: "Medium"
    },
  ];

  const filteredZones = selectedLayer === "all" 
    ? zones 
    : zones.filter(zone => zone.type === selectedLayer);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "High": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GovHeader />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Environmental Map</h1>
              <p className="text-gray-600">Explore environmental zones and check risks before applying</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Layer Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Map Layers</h2>
              <div className="space-y-2">
                {layers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedLayer === layer.id
                          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{layer.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Risk Level</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-xs text-gray-600">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Map & Zones */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M30 10 L35 25 L50 25 L38 35 L43 50 L30 40 L17 50 L22 35 L10 25 L25 25 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}></div>
                <div className="relative text-center">
                  <Map className="w-24 h-24 text-green-600 mx-auto mb-4 opacity-40" />
                  <p className="text-gray-600 font-medium">Interactive Map View</p>
                  <p className="text-sm text-gray-500 mt-2">Click on zones below to view details</p>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">Environmental Risk Assessment</h3>
                  <p className="text-sm text-blue-800">
                    Use this map to check environmental risks before submitting your clearance application. 
                    Projects in high-risk zones may require additional documentation and assessments.
                  </p>
                </div>
              </div>
            </div>

            {/* Zones Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Environmental Zones ({filteredZones.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredZones.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                      selectedZone === zone.id
                        ? "border-green-500 shadow-xl"
                        : "border-gray-200 hover:border-green-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          zone.type === "forest" ? "bg-green-100" :
                          zone.type === "wildlife" ? "bg-blue-100" :
                          zone.type === "crz" ? "bg-cyan-100" :
                          "bg-red-100"
                        }`}>
                          {zone.type === "forest" && <Trees className="w-5 h-5 text-green-600" />}
                          {zone.type === "wildlife" && <Bird className="w-5 h-5 text-blue-600" />}
                          {zone.type === "crz" && <Waves className="w-5 h-5 text-cyan-600" />}
                          {zone.type === "pollution" && <Factory className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{zone.name}</h3>
                          <p className="text-xs text-gray-500">{zone.state}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(zone.risk)}`}>
                        {zone.risk} Risk
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-semibold text-gray-900">{zone.area}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-gray-900">{zone.status}</span>
                      </div>
                    </div>

                    {selectedZone === zone.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                          View Full Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
