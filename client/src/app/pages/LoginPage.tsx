import { Link, useNavigate } from "react-router";
import { Leaf, Mail, Lock, UserCircle, Shield, CheckCircle, Camera, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { authApi, type BackendRole } from "../services/api";
import logoImage from "figma:asset/04582d5cbcbafd55748615841a24afdf6cfa7d0a.png";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithBackend } = useUser();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    role: "proponent"
  });
  const [adminStep, setAdminStep] = useState<"credentials" | "face">("credentials");
  const [preAuthToken, setPreAuthToken] = useState("");
  const [adminScanRunning, setAdminScanRunning] = useState(false);
  const [adminFacePreview, setAdminFacePreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const getRoleKey = (role: string) =>
    role === "proponent"
      ? "proponent"
      : role === "scrutiny"
        ? "scrutiny"
        : role === "mom"
          ? "mom"
          : "admin";

  const getBackendRole = (role: string): BackendRole =>
    role === "proponent"
      ? "PROPONENT"
      : role === "scrutiny"
        ? "SCRUTINY"
        : role === "mom"
          ? "MOM"
          : "ADMIN";

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (formData.role !== "admin") {
      setAdminStep("credentials");
      setPreAuthToken("");
      setAdminFacePreview("");
      stopCamera();
    }
  }, [formData.role]);

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    stopCamera();
    setAdminFacePreview("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus("Camera ready. Scan will run for 2.5 seconds.");
    } catch (cameraError) {
      setError("Camera access failed. Please allow camera permission and retry.");
    }
  };

  const collectLiveFrames = (durationMs = 2500, intervalMs = 250): Promise<string[]> =>
    new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
        resolve([]);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      const frames: string[] = [];
      const started = Date.now();

      const tick = setInterval(() => {
        const elapsed = Date.now() - started;
        if (elapsed > durationMs) {
          clearInterval(tick);
          resolve(frames);
          return;
        }

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.88));
      }, intervalMs);
    });

  const handleAdminCredentialStep = async () => {
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError("ID and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const precheck = await authApi.adminPrecheck({
        loginId: formData.identifier.trim(),
        password: formData.password,
      });

      setPreAuthToken(precheck.preAuthToken);
      setAdminStep("face");
      await startCamera();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFaceStep = async () => {
    if (!preAuthToken) {
      setError("Session expired. Please verify ID and password again.");
      setAdminStep("credentials");
      return;
    }

    setAdminScanRunning(true);
    setLoading(true);
    setError("");
    setStatus("Scanning face for 2.5 seconds...");

    try {
      const frames = await collectLiveFrames(2500, 250);
      if (!frames.length) {
        setError("Could not capture face frames. Please retry.");
        return;
      }

      setAdminFacePreview(frames[frames.length - 1]);
      setStatus("Verifying face...");

      const payload = await authApi.adminFaceLogin({
        preAuthToken,
        faceImages: frames,
      });

      loginWithBackend(payload);
      navigate("/dashboard/admin");
    } catch (err: any) {
      const message = err?.response?.data?.message || "login failed";
      setError(message);
      if (String(message).toLowerCase().includes("session expired")) {
        setAdminStep("credentials");
        setPreAuthToken("");
        stopCamera();
      }
    } finally {
      setLoading(false);
      setAdminScanRunning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setStatus("");

    const role = getRoleKey(formData.role);

    if (role === "admin") {
      if (adminStep === "credentials") {
        await handleAdminCredentialStep();
      } else {
        await handleAdminFaceStep();
      }
      return;
    }

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setError("Credentials are required.");
      return;
    }

    setLoading(true);
    try {
      const backendRole = getBackendRole(role);
      const payload =
        backendRole === "PROPONENT" && formData.identifier.includes("@")
          ? {
              role: backendRole,
              email: formData.identifier.trim(),
              password: formData.password,
            }
          : {
              role: backendRole,
              loginId: formData.identifier.trim(),
              password: formData.password,
            };

      const loginResponse = await authApi.login(payload);
      loginWithBackend(loginResponse);
      navigate(`/dashboard/${role}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBypass = async () => {
    const role = getRoleKey(formData.role);
    const backendRole = getBackendRole(role);
    const defaultIds: Record<string, string> = {
      admin: "Admin1",
      proponent: "Prop1",
      scrutiny: "Scrutiny1",
      mom: "Mom1",
    };

    setLoading(true);
    setError("");
    try {
      const loginResponse = await authApi.quickLogin({
        role: backendRole,
        loginId: defaultIds[role],
      });
      loginWithBackend(loginResponse);
      navigate(`/dashboard/${role}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Quick bypass failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px]">
            {/* Left Side - Branding */}
            <div className="bg-gradient-to-br from-slate-700 via-teal-700 to-emerald-800 p-10 flex flex-col justify-center text-white relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                {/* Logo */}
                <div className="mb-6">
                  <img 
                    src={logoImage}
                    alt="Ministry of Environment, Forest and Climate Change"
                    className="h-16 mb-4"
                  />
                  
                  {/* National Flag Colors Indicator */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="w-16 h-1 bg-orange-500 rounded"></div>
                    <div className="w-16 h-1 bg-white rounded"></div>
                    <div className="w-16 h-1 bg-green-300 rounded"></div>
                  </div>
                </div>

                {/* Portal Name */}
                <div className="mb-6">
                  <h1 className="text-3xl font-black mb-2">PARIVESH</h1>
                  <p className="text-base text-slate-200 leading-relaxed mb-4">
                    Pro-Active and Responsive facilitation by Interactive, Virtuous and Environmental Single-window Hub
                  </p>
                  <div className="inline-block">
                    <h2 className="text-xl font-bold mb-1">PARIVESH 3.0</h2>
                    <p className="text-sm text-slate-300">Environmental Clearance Portal</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Secure & Compliant</p>
                      <p className="text-xs text-slate-300">Bank-grade security with complete regulatory compliance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">MoEFCC Certified</p>
                      <p className="text-xs text-slate-300">Official platform by Ministry of Environment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Fast Processing</p>
                      <p className="text-xs text-slate-300">Automated workflows for quick clearances</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="p-8 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <div className="mb-4">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Link>
                </div>

                {/* Form Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                  <p className="text-sm text-gray-600">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ID or Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {formData.role === "proponent" ? "ID or Email" : "ID"}
                    </label>
                    <div className="relative">
                      {formData.role === "proponent" ? (
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      ) : (
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      )}
                      <input
                        type="text"
                        required
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all text-sm"
                        placeholder={formData.role === "proponent" ? "ID or email" : "Admin1 / Scrutiny1 / Mom1"}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Select Role
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all appearance-none cursor-pointer text-sm"
                      >
                        <option value="proponent">Project Proponent</option>
                        <option value="scrutiny">Scrutiny Team</option>
                        <option value="mom">MoM Team</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    {/* Role Description */}
                    <p className="text-xs text-gray-500 mt-1.5">
                      {formData.role === "proponent" && "Submit and track environmental clearance applications"}
                      {formData.role === "scrutiny" && "Review applications and verify compliance documents"}
                      {formData.role === "mom" && "Generate and finalize meeting minutes"}
                      {formData.role === "admin" && "Step 1: ID/password, Step 2: live face verification"}
                    </p>
                  </div>

                  {formData.role === "admin" && adminStep === "face" && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Face Verification (Step 2)</p>
                      <div className="overflow-hidden rounded-lg border border-gray-300 bg-black h-44">
                        {!adminFacePreview ? (
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        ) : (
                          <img src={adminFacePreview} alt="Face preview" className="w-full h-full object-cover" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-3 py-1.5 text-xs rounded border border-gray-300 bg-white hover:bg-gray-100"
                          disabled={loading || adminScanRunning}
                        >
                          <span className="inline-flex items-center gap-1">
                            <Camera className="w-3 h-3" /> Restart Camera
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAdminStep("credentials");
                            setPreAuthToken("");
                            setAdminFacePreview("");
                            stopCamera();
                          }}
                          className="px-3 py-1.5 text-xs rounded border border-gray-300 bg-white hover:bg-gray-100"
                          disabled={loading || adminScanRunning}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {(status || error) && (
                    <div className="space-y-2">
                      {status && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">{status}</p>}
                      {error && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
                    </div>
                  )}

                  {/* Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                      <span className="ml-2 text-xs text-gray-600">Remember me</span>
                    </label>
                      <Link to="/contact" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                        Forgot Password?
                      </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all text-sm mt-2"
                  >
                    {loading
                      ? "Please wait..."
                      : formData.role === "admin"
                        ? adminStep === "credentials"
                          ? "Continue to Face Verification"
                          : adminScanRunning
                            ? "Scanning Face..."
                            : "Verify Face & Login"
                        : "Sign In"}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickBypass}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm"
                  >
                    Quick Bypass
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
                      Register here
                    </Link>
                  </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-6">
                  © 2026 Ministry of Environment, Forest and Climate Change
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}