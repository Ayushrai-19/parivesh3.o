import { DashboardLayout } from "../components/DashboardLayout";
import { User, Mail, Phone, Building, MapPin, Calendar, Shield, Edit2, Save, X, Key, Bell, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useUser } from "../contexts/UserContext";

export function ProfilePage() {
  const { role } = useParams();
  const { user, updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user);

  // Update editedProfile when user changes
  useEffect(() => {
    setEditedProfile(user);
  }, [user]);

  const handleSave = () => {
    if (editedProfile) {
      updateUserProfile(editedProfile);
      setIsEditing(false);
      alert("Profile updated successfully! Changes will reflect across the portal.");
    }
  };

  const handleCancel = () => {
    setEditedProfile(user);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedProfile({ ...editedProfile!, [field]: value });
  };

  if (!user || !editedProfile) {
    return (
      <DashboardLayout role={role || "proponent"}>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role || "proponent"}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.designation}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">{user.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Organization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">{user.organization}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Registered Since
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">{user.registeredDate}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">{user.address}</p>
                )}
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Role & Responsibilities</p>
                  <p className="text-sm text-gray-700">{user.roleDescription}</p>
                </div>
              </div>
            </div>

            {/* Role-Specific Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {role === "proponent" && (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.totalApplications}</p>
                    <p className="text-sm opacity-90">Total Applications</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.approvedApplications}</p>
                    <p className="text-sm opacity-90">Approved</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.pendingApplications}</p>
                    <p className="text-sm opacity-90">Pending</p>
                  </div>
                </>
              )}
              
              {role === "scrutiny" && (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.applicationsReviewed}</p>
                    <p className="text-sm opacity-90">Applications Reviewed</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.edsRequested}</p>
                    <p className="text-sm opacity-90">EDS Requested</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.applicationsReferred}</p>
                    <p className="text-sm opacity-90">Referred to MoM</p>
                  </div>
                </>
              )}
              
              {role === "mom" && (
                <>
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.gistsGenerated}</p>
                    <p className="text-sm opacity-90">Gists Generated</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.momsFinalized}</p>
                    <p className="text-sm opacity-90">MoMs Finalized</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.meetingsAttended}</p>
                    <p className="text-sm opacity-90">Meetings Attended</p>
                  </div>
                </>
              )}
              
              {role === "admin" && (
                <>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.totalUsers}</p>
                    <p className="text-sm opacity-90">Total Users</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.templatesManaged}</p>
                    <p className="text-sm opacity-90">Templates</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <p className="text-3xl font-bold mb-1">{user.systemUptime}</p>
                    <p className="text-sm opacity-90">System Uptime</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Security Settings
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-xs text-gray-500 mt-1">Update your account password</p>
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 mt-1">Add extra security to your account</p>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Preferences
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-gray-900">Language Settings</p>
                <p className="text-xs text-gray-500 mt-1">Current: English / हिंदी</p>
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors">
                <p className="font-medium text-gray-900">Notification Preferences</p>
                <p className="text-xs text-gray-500 mt-1">Manage email and SMS alerts</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}