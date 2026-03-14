import { useState, useEffect } from "react";
import { Clock, AlertTriangle, TrendingUp, Calendar, CheckCircle } from "lucide-react";

interface DeficiencyItem {
  id: string;
  description: string;
  priority: "critical" | "high" | "medium";
  estimatedDays: number;
}

const mockDeficiencies: DeficiencyItem[] = [
  {
    id: "1",
    description: "Missing digital signature on EIA Report",
    priority: "critical",
    estimatedDays: 2
  },
  {
    id: "2",
    description: "Expired environmental certification",
    priority: "critical",
    estimatedDays: 7
  },
  {
    id: "3",
    description: "Incomplete baseline data for air quality",
    priority: "high",
    estimatedDays: 5
  },
  {
    id: "4",
    description: "Missing annexure references",
    priority: "medium",
    estimatedDays: 1
  }
];

export function ResubmissionTimeEstimator() {
  const [deficiencies] = useState(mockDeficiencies);
  const [selectedItems, setSelectedItems] = useState<string[]>(deficiencies.map(d => d.id));
  const [estimatedDays, setEstimatedDays] = useState(0);
  const [resubmissionDate, setResubmissionDate] = useState("");

  useEffect(() => {
    calculateEstimate();
  }, [selectedItems]);

  const calculateEstimate = () => {
    const selected = deficiencies.filter(d => selectedItems.includes(d.id));
    
    // Calculate based on priority
    const criticalDays = Math.max(
      ...selected.filter(d => d.priority === "critical").map(d => d.estimatedDays),
      0
    );
    const highDays = Math.max(
      ...selected.filter(d => d.priority === "high").map(d => d.estimatedDays),
      0
    );
    const mediumDays = Math.max(
      ...selected.filter(d => d.priority === "medium").map(d => d.estimatedDays),
      0
    );

    // Critical items block everything, high items run in parallel with medium
    const totalDays = criticalDays + Math.max(highDays, mediumDays);
    
    setEstimatedDays(totalDays);

    // Calculate resubmission date
    const today = new Date();
    today.setDate(today.getDate() + totalDays);
    setResubmissionDate(today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }));
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Re-submission Time Estimation</h3>
        </div>
        <p className="text-blue-100 text-sm">
          Automatic timeline calculation based on deficiency priorities
        </p>
      </div>

      {/* Deficiency List */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Deficiencies to Address</h4>
          <span className="text-sm text-gray-500">
            {selectedItems.length} of {deficiencies.length} selected
          </span>
        </div>

        {deficiencies.map((deficiency) => {
          const isSelected = selectedItems.includes(deficiency.id);

          return (
            <div
              key={deficiency.id}
              className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => toggleItem(deficiency.id)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-900">{deficiency.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {deficiency.estimatedDays}d
                    </div>
                  </div>
                  
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 border rounded-full text-xs font-semibold ${getPriorityColor(
                      deficiency.priority
                    )}`}
                  >
                    {getPriorityIcon(deficiency.priority)}
                    {deficiency.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimation Result */}
      <div className="border-t-2 border-gray-100 p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estimatedDays} {estimatedDays === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mt-3">
              <p className="text-xs text-blue-700">
                <strong>Calculation:</strong> Critical items are sequential, high/medium items can be parallel
              </p>
            </div>
          </div>

          {/* Resubmission Date */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Target Resubmission</p>
                <p className="text-lg font-bold text-gray-900">{resubmissionDate}</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 mt-3">
              <p className="text-xs text-green-700">
                <strong>Note:</strong> Timeline auto-updates when you upload revised documents
              </p>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
          <h5 className="font-bold text-gray-900 mb-4">Priority Breakdown</h5>
          <div className="space-y-3">
            {["critical", "high", "medium"].map((priority) => {
              const items = deficiencies.filter(
                d => d.priority === priority && selectedItems.includes(d.id)
              );
              const maxDays = items.length > 0
                ? Math.max(...items.map(d => d.estimatedDays))
                : 0;

              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getPriorityIcon(priority)}</span>
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {priority} Priority
                    </span>
                    <span className="text-xs text-gray-500">
                      ({items.length} {items.length === 1 ? "item" : "items"})
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {maxDays} {maxDays === 1 ? "day" : "days"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 bg-blue-100 border-l-4 border-blue-600 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Timeline will recalculate automatically</p>
              <p>
                As you upload revised documents, the system will automatically update the estimated
                resubmission date based on remaining deficiencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
