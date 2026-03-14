import { useState, useCallback } from "react";
import { Upload, X, FileText, AlertTriangle, CheckCircle, Loader2, Eye, XCircle } from "lucide-react";

interface ScanError {
  type: "error" | "warning" | "success";
  message: string;
  page?: number;
  severity: "critical" | "high" | "medium" | "low";
}

interface ScanResult {
  fileName: string;
  fileSize: string;
  format: string;
  errors: ScanError[];
  scanned: boolean;
  reviewedByAI: boolean;
}

export function AIDocumentScanner() {
  const [files, setFiles] = useState<ScanResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    processFiles(selectedFiles);
  }, []);

  const processFiles = async (newFiles: File[]) => {
    setScanning(true);

    for (const file of newFiles) {
      // Simulate AI scanning
      const scanResult: ScanResult = {
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        format: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        errors: await simulateAIScan(file),
        scanned: false,
        reviewedByAI: false,
      };

      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      scanResult.scanned = true;
      setFiles(prev => [...prev, scanResult]);
    }

    setScanning(false);
  };

  const simulateAIScan = async (file: File): Promise<ScanError[]> => {
    const errors: ScanError[] = [];
    const fileName = file.name.toLowerCase();

    // Simulate AI detection
    if (fileName.includes("eia")) {
      errors.push({
        type: "error",
        message: "Missing digital signature on page 3",
        page: 3,
        severity: "critical"
      });
      errors.push({
        type: "warning",
        message: "Date format inconsistency detected",
        page: 5,
        severity: "medium"
      });
    }

    if (fileName.includes("baseline")) {
      errors.push({
        type: "error",
        message: "Certification expired (Valid until: 2025-12-31)",
        severity: "high"
      });
      errors.push({
        type: "warning",
        message: "Missing annexure reference on page 12",
        page: 12,
        severity: "low"
      });
    }

    if (fileName.includes("legal")) {
      errors.push({
        type: "error",
        message: "Blank page detected at page 7",
        page: 7,
        severity: "high"
      });
    }

    // Add some success messages
    if (errors.filter(e => e.type === "error").length === 0) {
      errors.push({
        type: "success",
        message: "All mandatory sections present and valid",
        severity: "low"
      });
      errors.push({
        type: "success",
        message: "Digital signatures verified",
        severity: "low"
      });
    }

    return errors;
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAIReview = (index: number) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, reviewedByAI: !file.reviewedByAI } : file
    ));
  };

  const groupedErrors = (errors: ScanError[]) => {
    const critical = errors.filter(e => e.severity === "critical");
    const high = errors.filter(e => e.severity === "high");
    const medium = errors.filter(e => e.severity === "medium");
    const low = errors.filter(e => e.severity === "low" && e.type !== "success");
    const success = errors.filter(e => e.type === "success");

    return { critical, high, medium, low, success };
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50 scale-[1.02]"
            : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          multiple
          accept=".pdf,.docx,.jpg,.jpeg,.png"
        />
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isDragging ? "Drop files here" : "AI-Powered Document Scanner"}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Drag and drop your documents here, or{" "}
            <label htmlFor="file-upload" className="text-blue-600 font-semibold cursor-pointer hover:underline">
              browse files
            </label>
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">JPG/PNG</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Max 10MB</span>
          </div>
        </div>
      </div>

      {/* Scanning Progress */}
      {scanning && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">AI Scanning in Progress...</p>
              <p className="text-sm text-blue-700">Analyzing documents for errors and inconsistencies</p>
            </div>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">📄 Document Scan Results</h3>
          
          {files.map((file, index) => {
            const grouped = groupedErrors(file.errors);
            const hasErrors = grouped.critical.length > 0 || grouped.high.length > 0 || grouped.medium.length > 0;
            
            return (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* File Header */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{file.fileName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span>{file.fileSize}</span>
                          <span>•</span>
                          <span>{file.format}</span>
                          {file.scanned && (
                            <>
                              <span>•</span>
                              <span className="text-green-600 font-medium">✓ Scanned</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scan Results */}
                {file.scanned && (
                  <div className="p-6 space-y-4">
                    {/* Critical Errors */}
                    {grouped.critical.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-bold text-red-700 uppercase tracking-wide">
                          🔴 Critical Errors ({grouped.critical.length})
                        </h5>
                        {grouped.critical.map((error, i) => (
                          <div key={i} className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                            <p className="text-sm text-red-900 font-medium">{error.message}</p>
                            {error.page && <p className="text-xs text-red-700 mt-1">Page {error.page}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* High Priority Errors */}
                    {grouped.high.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-bold text-orange-700 uppercase tracking-wide">
                          🟠 High Priority ({grouped.high.length})
                        </h5>
                        {grouped.high.map((error, i) => (
                          <div key={i} className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                            <p className="text-sm text-orange-900 font-medium">{error.message}</p>
                            {error.page && <p className="text-xs text-orange-700 mt-1">Page {error.page}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Medium Priority Warnings */}
                    {grouped.medium.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                          🟡 Medium Priority ({grouped.medium.length})
                        </h5>
                        {grouped.medium.map((error, i) => (
                          <div key={i} className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                            <p className="text-sm text-yellow-900 font-medium">{error.message}</p>
                            {error.page && <p className="text-xs text-yellow-700 mt-1">Page {error.page}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Valid Sections */}
                    {grouped.success.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-bold text-green-700 uppercase tracking-wide">
                          🟢 Valid Sections ({grouped.success.length})
                        </h5>
                        {grouped.success.map((error, i) => (
                          <div key={i} className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                            <p className="text-sm text-green-900 font-medium">{error.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Review Checkbox */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <input
                        type="checkbox"
                        id={`ai-review-${index}`}
                        checked={file.reviewedByAI}
                        onChange={() => toggleAIReview(index)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor={`ai-review-${index}`} className="text-sm font-medium text-gray-700">
                        Mark as reviewed by AI
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Eye className="w-5 h-5" />
                        Proceed with Review
                      </button>
                      
                      {hasErrors && (
                        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Raise Deficiency
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
