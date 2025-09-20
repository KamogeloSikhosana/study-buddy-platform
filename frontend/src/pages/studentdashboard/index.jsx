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
  lilac: "#ac98cd",
  plum: "#6a509b",
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
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },,
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
                  ? "bg-gray-200 text-gray-900 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0 text-gray-600">{item.icon}</div>
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

// ----------- Pages ----------- //
function DashboardPage() {
  return <div className="p-6">📊 Welcome to your dashboard</div>;
}



function ResourcesPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Allowed file types
  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter for allowed file types
    const validFiles = files.filter(file => 
      allowedFileTypes.includes(file.type)
    );
    
    if (validFiles.length === 0) {
      alert('Please upload only Word, PDF, Excel, or PowerPoint files');
      return;
    }
    
    setUploading(true);
    
    // Simulate file upload (in a real app, you would upload to a server)
    setTimeout(() => {
      const newDocuments = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toLocaleDateString(),
        url: URL.createObjectURL(file) // In a real app, this would be a server URL
      }));
      
      setDocuments(prev => [...prev, ...newDocuments]);
      setUploading(false);
      e.target.value = ''; // Reset file input
    }, 1000);
  };

  // Handle file deletion
  const handleDeleteFile = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes('word')) return '📝';
    if (type.includes('pdf')) return '📄';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📑';
    return '📁';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <Card title="Resources" subtitle="Upload and manage your study materials">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center">
              <div className="mb-4">
                <FolderOpen size={48} className="mx-auto text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: Word, PDF, Excel, PowerPoint
              </p>
              
              <label className="cursor-pointer inline-block px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                {uploading ? 'Uploading...' : 'Select Files'}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card title="Documents" subtitle="Your uploaded files">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload your first file to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getFileIcon(doc.type)}</span>
                        <div>
                          <h4 className="font-medium text-sm">{doc.name}</h4>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(doc.size)} • {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.url}
                          download={doc.name}
                          className="p-2 text-gray-600 hover:text-gray-800"
                          title="Download"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                        <button
                          onClick={() => handleDeleteFile(doc.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
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

  return (
    <Card title="Settings" subtitle="Manage your profile and account preferences">
      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "profile"
              ? "border-b-2 border-gray-700 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "account"
              ? "border-b-2 border-gray-700 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Account
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="p-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg shadow-sm mb-6 bg-white">
            <img
              src={preview || "https://via.placeholder.com/80"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-lg font-semibold">Student Name</h2>
              <p className="text-sm text-gray-500">University</p>
              <label className="mt-2 inline-block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <span className="cursor-pointer px-3 py-1 mt-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800">
                  Upload New
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Personal Information</h3>
              <div className="space-y-4">
                <input className="w-full p-2 border rounded-lg" placeholder="First Name" />
                <input className="w-full p-2 border rounded-lg" placeholder="Last Name" />
                <textarea rows={3} className="w-full p-2 border rounded-lg" placeholder="Bio" />
                <input className="w-full p-2 border rounded-lg" placeholder="University" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Study Information</h3>
              <div className="space-y-4">
                <input className="w-full p-2 border rounded-lg" placeholder="Course" />
                <input className="w-full p-2 border rounded-lg" placeholder="Year of Study" />
                <input className="w-full p-2 border rounded-lg" placeholder="Address" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">Save Changes</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Account Settings</h3>
          <div className="space-y-4 max-w-md">
            <input className="w-full p-2 border rounded-lg" placeholder="Email" />
            <input type="password" className="w-full p-2 border rounded-lg" placeholder="Password" />
            <input type="password" className="w-full p-2 border rounded-lg" placeholder="Confirm Password" />
          </div>
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:opacity-90">Save Changes</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ----------- Study Circle Page -----------
const initialGroups = [
  {
    id: 1,
    name: "Calculus Study Group",
    course: "Mathematics",
    module: "Calculus 101",
    university: "NWU",
    members: ["Student Name", "Alice", "Bob"],
    owner: "Student Name",
  },
  {
    id: 2,
    name: "Physics Pals",
    course: "Physics",
    module: "Mechanics",
    university: "UCT",
    members: ["Charlie"],
    owner: "Other Student",
  },
];

function StudyCirclePage() {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    course: "",
    module: "",
    university: "",
  });
  const [currentUser] = useState("Student Name");

  const filteredGroups = groups.filter((g) =>
    [g.name, g.course, g.module, g.university].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleJoin = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isMember = g.members.includes(currentUser);
          return {
            ...g,
            members: isMember
              ? g.members.filter((m) => m !== currentUser)
              : [...g.members, currentUser],
          };
        }
        return g;
      })
    );
  };

  const handleCreateGroup = () => {
    if (!newGroup.name) return;
    const newId = groups.length + 1;
    setGroups([
      ...groups,
      { ...newGroup, id: newId, members: [currentUser], owner: currentUser },
    ]);
    setNewGroup({ name: "", course: "", module: "", university: "" });
  };

  const removeMember = (groupId, member) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m !== member) }
          : g
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Card title="Study Circles">
        <input
          type="text"
          placeholder="Search by group, course, module, university..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
        />

        {filteredGroups.length === 0 ? (
          <p className="text-gray-500">No groups found.</p>
        ) : (
          filteredGroups.map((g) => (
            <div
              key={g.id}
              className="p-4 mb-3 border rounded-lg flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-sm text-gray-500">
                  {g.course} - {g.module} ({g.university})
                </p>
                <p className="text-xs text-gray-400">Members: {g.members.join(", ")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleJoin(g.id)}
                  className={`px-4 py-1 rounded-lg text-white text-sm ${
                    g.members.includes(currentUser)
                      ? "bg-gray-400 hover:bg-gray-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {g.members.includes(currentUser) ? "Unjoin" : "Join"}
                </button>

                {g.owner === currentUser && g.members.length > 1 && (
                  <button
                    onClick={() =>
                      removeMember(
                        g.id,
                        g.members.find((m) => m !== currentUser)
                      )
                    }
                    className="px-4 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 text-sm"
                  >
                    Remove Member
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </Card>

      <Card title="Create New Study Group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "course", "module", "university"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newGroup[field]}
              onChange={(e) =>
                setNewGroup({ ...newGroup, [field]: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          ))}
        </div>
        <button
          onClick={handleCreateGroup}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Group
        </button>
      </Card>
    </div>
  );
}

// ----------- Main App -----------
export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;
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
