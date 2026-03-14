import { Check } from "lucide-react";

interface WorkflowStep {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface WorkflowTimelineProps {
  currentStatus: string;
}

const allSteps = [
  { id: "draft", label: "Draft" },
  { id: "submitted", label: "Submitted" },
  { id: "scrutiny", label: "Under Scrutiny" },
  { id: "eds", label: "EDS" },
  { id: "referred", label: "Referred" },
  { id: "mom", label: "MoM Generated" },
  { id: "finalized", label: "Finalized" },
];

export function WorkflowTimeline({ currentStatus }: WorkflowTimelineProps) {
  const currentIndex = allSteps.findIndex(step => step.id === currentStatus.toLowerCase());
  
  const steps: WorkflowStep[] = allSteps.map((step, index) => ({
    ...step,
    status: index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming"
  }));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-6">Application Workflow</h3>
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-5 left-5 h-full w-0.5 bg-gray-200" />
        
        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center gap-4">
              {/* Step Circle */}
              <div
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.status === "completed"
                    ? "bg-gradient-to-br from-green-500 to-green-600 border-green-500"
                    : step.status === "current"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 ring-4 ring-blue-100"
                    : "bg-white border-gray-300"
                }`}
              >
                {step.status === "completed" ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      step.status === "current" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              
              {/* Step Label */}
              <div>
                <p
                  className={`font-medium ${
                    step.status === "upcoming" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {step.label}
                </p>
                {step.status === "current" && (
                  <p className="text-xs text-blue-600">In Progress</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
