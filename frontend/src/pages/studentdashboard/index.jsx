import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

// Theme colors
const colors = {
  paper: "#e7e7e7",
  mist: "#d2d3de",
  blueLight: "#e0f2fe",
  blueDark: "#1d4ed8",
};

// ----------- Reusable Card wrapper -----------
function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ----------- Sidebar ------------
function Sidebar({ page, setPage, onLogout }) {
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "find-partner", label: "Find Study Partner", icon: <Users size={18} /> },
    { key: "study-circle", label: "Study Circle", icon: <BookOpen size={18} /> },
    { key: "resources", label: "Resources", icon: <FolderOpen size={18} /> },
    { key: "forum", label: "Forum", icon: <MessageSquare size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 z-40">
      <div
        className="flex flex-col h-full p-4 rounded-r-3xl"
        style={{
          background: "white",
          borderRight: `1px solid ${colors.mist}`,
        }}
      >
        {/* Logo */}
        <div className="mb-8 px-2 flex items-center">
          <img src="/src/assets/logo.png" alt="StudyBuddy logo" className="h-10 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left transition ${
                page === item.key
                  ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="text-sm font-medium truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div>
          <div className="mb-4 p-3 rounded-2xl" style={{ background: colors.mist }}>
            <div className="text-xs opacity-70 mb-1">Logged in as</div>
            <div className="text-sm font-semibold">Student</div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left transition text-gray-700 hover:bg-red-100 hover:text-red-600"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ----------- Pages -----------
function DashboardPage() {
  return <div className="p-6">📊 Welcome to your dashboard</div>;
}

function FindPartnerPage() {
  return <div className="p-6">👥 Match with study partners</div>;
}

function StudyCirclePage() {
  return <div className="p-6">📚 Join or create study circles</div>;
}

function ResourcesPage() {
  return <div className="p-6">📂 Upload & download resources</div>;
}

function ForumPage() {
  return <div className="p-6">💬 Participate in forum discussions</div>;
}

// ---------- Settings Page ----------
function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const inputClass =
    "w-full p-2 text-sm text-gray-700 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <Card title="Settings" subtitle="Manage your profile and account preferences">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        {["profile", "account"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "profile" ? "Profile" : "Account"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="p-4 space-y-6">
          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-white">
            <img
              src={preview || "https://via.placeholder.com/120"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Student Name</h2>
              <p className="text-sm text-gray-500">University</p>
              <label className="mt-2 inline-block cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <span className="px-4 py-2 mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm rounded-lg hover:opacity-90 transition">
                  Upload New
                </span>
              </label>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Personal Information</h3>
              <div className="space-y-4">
                <input className={inputClass} placeholder="First Name" />
                <input className={inputClass} placeholder="Last Name" />
                <textarea rows={3} className={inputClass} placeholder="Bio" />
                <input className={inputClass} placeholder="University" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Study Information</h3>
              <div className="space-y-4">
                <input className={inputClass} placeholder="Course" />
                <input className={inputClass} placeholder="Year of Study" />
                <input className={inputClass} placeholder="Address" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:opacity-90 transition">
              Save Changes
            </button>
            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="p-4 space-y-4 max-w-md">
          <h3 className="font-semibold text-gray-700 mb-3">Account Settings</h3>
          <input className={inputClass} placeholder="Email" />
          <input type="password" className={inputClass} placeholder="Password" />
          <input type="password" className={inputClass} placeholder="Confirm Password" />
          <div className="mt-6 flex gap-3">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:opacity-90 transition">
              Save Changes
            </button>
            <button className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ----------- Main App -----------
export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;
      case "find-partner":
        return <FindPartnerPage />;
      case "study-circle":
        return <StudyCirclePage />;
      case "resources":
        return <ResourcesPage />;
      case "forum":
        return <ForumPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex">
      <Sidebar page={page} setPage={setPage} onLogout={() => alert("Logged out")} />
      <main className="ml-64 flex-1 p-6 bg-gray-50 min-h-screen">{renderPage()}</main>
    </div>
  );
}
