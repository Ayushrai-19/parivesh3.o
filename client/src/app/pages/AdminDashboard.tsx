import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Calendar,
  Eye,
  FileText,
  Plus,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import {
  type AdminApplication,
  type AdminAuditLog,
  type AdminLoginActivity,
  type AdminPayment,
  type AdminPaymentsResponse,
  type AdminUser,
  type BackendGist,
  type BackendTimeline,
  workflowApi,
} from "../services/workflowApi";

type TabKey = "overview" | "users" | "applications" | "payments" | "audit";

const formatDateTime = (value: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const roleLabel = (role: AdminUser["role"] | AdminLoginActivity["role"]) => {
  if (role === "SCRUTINY") return "Scrutiny";
  if (role === "MOM") return "MoM";
  if (role === "PROPONENT") return "Proponent";
  return "Admin";
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [paymentsData, setPaymentsData] = useState<AdminPaymentsResponse | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loginActivity, setLoginActivity] = useState<AdminLoginActivity[]>([]);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    loginId: "",
    password: "",
    role: "SCRUTINY" as "SCRUTINY" | "MOM",
  });

  const [appSearch, setAppSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");

  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AdminApplication | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<BackendTimeline | null>(null);
  const [selectedGist, setSelectedGist] = useState<BackendGist | null>(null);

  const loadAll = async () => {
    try {
      setError("");
      setIsLoading(true);
      const [usersRes, applicationsRes, paymentsRes, auditRes, loginRes] = await Promise.all([
        workflowApi.adminListUsers(),
        workflowApi.adminListApplications(1, 200),
        workflowApi.adminListPayments(1, 200),
        workflowApi.adminListAuditLogs(),
        workflowApi.adminListLoginActivity(1, 100),
      ]);

      setUsers(usersRes);
      setApplications(applicationsRes.items);
      setPaymentsData(paymentsRes);
      setAuditLogs(auditRes);
      setLoginActivity(loginRes.items);
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message || "Unable to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = userSearch.trim().toLowerCase();
    if (!search) return users;
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.login_id.toLowerCase().includes(search)
      );
    });
  }, [users, userSearch]);

  const filteredApplications = useMemo(() => {
    const search = appSearch.trim().toLowerCase();
    if (!search) return applications;
    return applications.filter((app) => {
      return (
        String(app.id).includes(search) ||
        app.project_name.toLowerCase().includes(search) ||
        (app.proponent_name || "").toLowerCase().includes(search) ||
        app.status.toLowerCase().includes(search)
      );
    });
  }, [applications, appSearch]);

  const filteredPayments = useMemo(() => {
    const items = paymentsData?.items || [];
    const search = paymentSearch.trim().toLowerCase();
    if (!search) return items;
    return items.filter((payment) => {
      return (
        String(payment.application_id).includes(search) ||
        payment.transaction_reference.toLowerCase().includes(search) ||
        payment.project_name.toLowerCase().includes(search) ||
        payment.proponent_name.toLowerCase().includes(search)
      );
    });
  }, [paymentsData, paymentSearch]);

  const summary = useMemo(() => {
    const totalApplications = applications.length;
    const submitted = applications.filter((app) => app.status === "SUBMITTED").length;
    const underScrutiny = applications.filter((app) => app.status === "UNDER_SCRUTINY").length;
    const referred = applications.filter((app) => app.status === "REFERRED").length;
    const momGenerated = applications.filter((app) => app.status === "MOM_GENERATED").length;
    const finalized = applications.filter((app) => app.status === "FINALIZED").length;
    const gistGenerated = applications.filter((app) => Boolean(app.generated_at)).length;
    const activeUsers = users.filter((user) => user.role === "SCRUTINY" || user.role === "MOM").length;
    return {
      totalApplications,
      submitted,
      underScrutiny,
      referred,
      momGenerated,
      finalized,
      gistGenerated,
      activeUsers,
    };
  }, [applications, users]);

  const handleCreateUser = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setIsSubmitting(true);

      await workflowApi.adminCreateUser({
        name: newUser.name.trim(),
        loginId: newUser.loginId.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
      });

      setShowCreateUserModal(false);
      setNewUser({ name: "", email: "", loginId: "", password: "", role: "SCRUTINY" });
      setSuccessMessage("User created successfully.");
      await loadAll();
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message || "Unable to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewWorkflow = async (application: AdminApplication) => {
    try {
      setError("");
      setSelectedApplication(application);
      setShowWorkflowModal(true);

      const [timelineRes, gistRes] = await Promise.all([
        workflowApi.getApplicationTimeline(application.id),
        workflowApi.getGist(application.id).catch(() => null),
      ]);

      setSelectedTimeline(timelineRes);
      setSelectedGist(gistRes);
    } catch (viewError: any) {
      setError(viewError?.response?.data?.message || "Unable to load application workflow.");
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Live data for proponent submissions, scrutiny flow, gist generation, and MoM finalization</p>
        </div>

        {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {successMessage ? <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div> : null}

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "users", label: "Users", icon: Users },
              { id: "applications", label: "Applications", icon: FileText },
              { id: "payments", label: "Payments", icon: Shield },
              { id: "audit", label: "Audit", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id ? "border-green-600 text-green-700" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <div className="rounded-2xl border border-gray-200 bg-white p-10 text-sm text-gray-500">Loading admin data...</div> : null}

        {!isLoading && activeTab === "overview" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500 uppercase">Applications</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{summary.totalApplications}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500 uppercase">Under Scrutiny</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{summary.underScrutiny}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500 uppercase">Gists Generated</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{summary.gistGenerated}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500 uppercase">MoM Finalized</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">{summary.finalized}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Workflow Status Snapshot</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between"><span>Submitted</span><span className="font-semibold">{summary.submitted}</span></div>
                  <div className="flex items-center justify-between"><span>Under Scrutiny</span><span className="font-semibold">{summary.underScrutiny}</span></div>
                  <div className="flex items-center justify-between"><span>Referred</span><span className="font-semibold">{summary.referred}</span></div>
                  <div className="flex items-center justify-between"><span>MoM Generated</span><span className="font-semibold">{summary.momGenerated}</span></div>
                  <div className="flex items-center justify-between"><span>Finalized</span><span className="font-semibold">{summary.finalized}</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Team Snapshot</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between"><span>Active scrutiny/mom users</span><span className="font-semibold">{summary.activeUsers}</span></div>
                  <div className="flex items-center justify-between"><span>Recent admin audit entries</span><span className="font-semibold">{auditLogs.length}</span></div>
                  <div className="flex items-center justify-between"><span>Login activity records</span><span className="font-semibold">{loginActivity.length}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === "users" ? (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">Users</h3>
                <p className="text-xs text-gray-500">Live users created by admin and proponent registrations</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateUserModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Create User
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search users by name, email, or login ID"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Login ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{user.login_id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{roleLabel(user.role)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(user.created_at)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(user.last_login)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === "applications" ? (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Applications</h3>
              <p className="text-xs text-gray-500">Real submissions from proponents with scrutiny and MoM progress</p>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                value={appSearch}
                onChange={(event) => setAppSearch(event.target.value)}
                placeholder="Search by ID, project, proponent, or status"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Proponent</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Docs</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Gist</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">MoM</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">#{app.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{app.project_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.proponent_name}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.documents_count}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.successful_payments > 0 ? "Paid" : "Unpaid"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.generated_at ? (app.gist_edited ? "Edited" : "Generated") : "Not generated"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.mom_id ? (app.mom_locked ? "Finalized" : "Draft") : "Not generated"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void handleViewWorkflow(app)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === "payments" ? (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Payments</h3>
              <p className="text-xs text-gray-500">Real payment records submitted by proponents</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b border-gray-200 bg-gray-50">
              <div className="rounded-lg bg-white border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Total Transactions</div>
                <div className="text-xl font-semibold text-gray-900 mt-1">{paymentsData?.summary.total_transactions || 0}</div>
              </div>
              <div className="rounded-lg bg-white border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Successful</div>
                <div className="text-xl font-semibold text-green-700 mt-1">{paymentsData?.summary.success_transactions || 0}</div>
              </div>
              <div className="rounded-lg bg-white border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Failed</div>
                <div className="text-xl font-semibold text-red-700 mt-1">{paymentsData?.summary.failed_transactions || 0}</div>
              </div>
              <div className="rounded-lg bg-white border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Successful Amount</div>
                <div className="text-xl font-semibold text-gray-900 mt-1">₹{paymentsData?.summary.successful_amount || "0.00"}</div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                value={paymentSearch}
                onChange={(event) => setPaymentSearch(event.target.value)}
                placeholder="Search by app ID, project, proponent, or transaction reference"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">App ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Proponent</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment: AdminPayment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">#{payment.application_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{payment.project_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.proponent_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">₹{Number(payment.amount).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.method_label}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{payment.transaction_reference}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={payment.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(payment.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === "audit" ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Application Audit Log</h3>
                <p className="text-xs text-gray-500">Status transitions and workflow actions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">App ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Change</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-green-700">#{log.application_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{log.old_status ? `${log.old_status} -> ${log.new_status}` : log.new_status}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.changed_by_name || "System"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{log.notes || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(log.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Team Login Activity</h3>
                <p className="text-xs text-gray-500">Scrutiny and MoM sign-in records</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Identifier</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loginActivity.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{entry.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{roleLabel(entry.role)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{entry.login_method}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{entry.identifier_used || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(entry.login_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {showCreateUserModal ? (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900">Create Team User</h3>
                </div>
                <button type="button" onClick={() => setShowCreateUserModal(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={newUser.loginId}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, loginId: event.target.value }))}
                  placeholder="Login ID"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Temporary password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <select
                  value={newUser.role}
                  onChange={(event) => setNewUser((prev) => ({ ...prev, role: event.target.value as "SCRUTINY" | "MOM" }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="SCRUTINY">Scrutiny</option>
                  <option value="MOM">MoM</option>
                </select>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  This user will receive credentials by email and can log in immediately.
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateUserModal(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleCreateUser()}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm disabled:opacity-50"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showWorkflowModal && selectedApplication ? (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Application Workflow</h3>
                  <p className="text-sm text-gray-600">#{selectedApplication.id} • {selectedApplication.project_name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowWorkflowModal(false);
                    setSelectedApplication(null);
                    setSelectedTimeline(null);
                    setSelectedGist(null);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="mt-2"><StatusBadge status={selectedApplication.status} /></div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-xs text-gray-500">Gist</div>
                    <div className="mt-2 text-sm text-gray-800">{selectedApplication.generated_at ? "Generated" : "Not generated"}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="text-xs text-gray-500">MoM</div>
                    <div className="mt-2 text-sm text-gray-800">
                      {selectedApplication.mom_id ? (selectedApplication.mom_locked ? "Finalized" : "Draft") : "Not generated"}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Audit Timeline</h4>
                  {selectedTimeline?.audit.length ? (
                    <div className="space-y-2">
                      {selectedTimeline.audit.map((item) => (
                        <div key={item.id} className="rounded-lg bg-gray-50 p-3 text-sm">
                          <div className="font-medium text-gray-900">{item.old_status ? `${item.old_status} -> ${item.new_status}` : item.new_status}</div>
                          <div className="text-xs text-gray-600 mt-1">{item.changed_by_name} • {formatDateTime(item.timestamp)}</div>
                          {item.notes ? <div className="text-xs text-gray-700 mt-1">{item.notes}</div> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No audit timeline available.</div>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Gist Content</h4>
                  {selectedGist ? (
                    <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700">{selectedGist.edited_content || selectedGist.content}</pre>
                  ) : (
                    <div className="text-sm text-gray-500">No gist found for this application.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
