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
          <img src="/src/assets/logo.png" alt="StudyBuddy logo" className="h-40 w-auto" />
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
    module: "Calculus 101",
    about: "Weekly study sessions for Calculus 101. All welcome!",
    owner: "Student Name",
    maxParticipants: 8,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/group1",
    meetingPlatform: "Microsoft Teams",
    members: ["Student Name", "Alice", "Bob"],
    sessions: [
      { id: 1, date: "2023-10-15", time: "14:00", topic: "Limits and Continuity" },
      { id: 2, date: "2023-10-22", time: "14:00", topic: "Derivatives" }
    ]
  },
  {
    id: 2,
    name: "Physics Pals",
    module: "Mechanics",
    about: "Study group for Physics Mechanics module",
    owner: "Other Student",
    maxParticipants: 6,
    meetingLink: "https://zoom.us/j/group2",
    meetingPlatform: "Zoom",
    members: ["Charlie"],
    sessions: []
  },
  {
    id: 3,
    name: "Biology Buddies",
    module: "Cell Biology",
    about: "Exploring the wonders of cell biology together",
    owner: "David",
    maxParticipants: 10,
    meetingLink: "https://meet.google.com/group3",
    meetingPlatform: "Google Meet",
    members: ["Student Name", "David", "Eva"],
    sessions: [
      { id: 3, date: "2023-10-18", time: "16:00", topic: "Cell Structures" }
    ]
  }
];

function StudyCirclePage() {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    joinedOnly: false,
    ownedOnly: false,
    withSlots: false
  });
  const [newGroup, setNewGroup] = useState({
    name: "",
    module: "",
    about: "",
    maxParticipants: 8,
    meetingLink: "",
    meetingPlatform: "Microsoft Teams"
  });
  const [newSession, setNewSession] = useState({ date: "", time: "", topic: "" });
  const [currentUser] = useState("Student Name");
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Filter groups based on search and filters
  const filteredGroups = groups.filter((g) => {
    // Search filter
    const matchesSearch = [g.name, g.module, g.about].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    );
    
    // Additional filters
    const matchesJoined = filters.joinedOnly ? g.members.includes(currentUser) : true;
    const matchesOwned = filters.ownedOnly ? g.owner === currentUser : true;
    const matchesSlots = filters.withSlots ? g.members.length < g.maxParticipants : true;
    
    return matchesSearch && matchesJoined && matchesOwned && matchesSlots;
  });

  // Toggle join/unjoin a group
  const toggleJoin = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isMember = g.members.includes(currentUser);
          // Check if group is full when joining
          if (!isMember && g.members.length >= g.maxParticipants) {
            alert("This group is already full.");
            return g;
          }
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

  // Create a new group
  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.module) return;
    const newId = groups.length + 1;
    setGroups([
      ...groups,
      { 
        ...newGroup, 
        id: newId, 
        members: [currentUser], 
        owner: currentUser,
        sessions: []
      },
    ]);
    setNewGroup({ 
      name: "", 
      module: "", 
      about: "", 
      maxParticipants: 8,
      meetingLink: "",
      meetingPlatform: "Microsoft Teams"
    });
    setActiveTab("browse");
  };

  // Add a session to a group
  const addSession = (groupId) => {
    if (!newSession.date || !newSession.topic) return;
    
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            sessions: [
              ...g.sessions,
              {
                id: Date.now(),
                ...newSession
              }
            ]
          };
        }
        return g;
      })
    );
    
    setNewSession({ date: "", time: "", topic: "" });
  };

  // Remove a session from a group
  const removeSession = (groupId, sessionId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            sessions: g.sessions.filter(s => s.id !== sessionId)
          };
        }
        return g;
      })
    );
  };

  // View group details
  const viewGroupDetails = (group) => {
    setSelectedGroup(group);
    setActiveTab("details");
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Meeting link copied to clipboard!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("browse")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "browse"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Browse Groups
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "create"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Create Group
        </button>
        {activeTab === "details" && selectedGroup && (
          <button
            className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600"
          >
            {selectedGroup.name}
          </button>
        )}
      </div>

      {/* Browse Groups Tab */}
      {activeTab === "browse" && (
        <>
          <Card title="Study Circles" subtitle="Find or manage your study groups">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by group name, module, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:col-span-3 p-2 border rounded-lg"
              />
              
              <div className="relative group">
                <button className="w-full p-2 border rounded-lg bg-gray-100 hover:bg-gray-200">
                  Filters ▾
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={filters.joinedOnly}
                      onChange={(e) => setFilters({...filters, joinedOnly: e.target.checked})}
                      className="mr-2"
                    />
                    Joined Groups Only
                  </label>
                  <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={filters.ownedOnly}
                      onChange={(e) => setFilters({...filters, ownedOnly: e.target.checked})}
                      className="mr-2"
                    />
                    My Groups Only
                  </label>
                  <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={filters.withSlots}
                      onChange={(e) => setFilters({...filters, withSlots: e.target.checked})}
                      className="mr-2"
                    />
                    With Available Slots
                  </label>
                </div>
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No groups found. Try adjusting your search or filters.</p>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 border rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{g.name}</h3>
                        <p className="text-sm text-gray-500">
                          {g.module} • Owner: {g.owner}
                        </p>
                        <p className="text-sm mt-1">{g.about}</p>
                        
                        <div className="flex items-center mt-3 text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                            {g.meetingPlatform}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {g.members.length}/{g.maxParticipants} members
                          </span>
                        </div>
                        
                        {g.sessions.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Next session: {g.sessions[0].date} at {g.sessions[0].time}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => viewGroupDetails(g)}
                          className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => toggleJoin(g.id)}
                          className={`px-3 py-1 rounded-lg text-white text-sm ${
                            g.members.includes(currentUser)
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {g.members.includes(currentUser) ? "Leave" : "Join"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {/* Create Group Tab */}
      {activeTab === "create" && (
        <Card title="Create New Study Group">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Advanced Calculus Study Group"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module *
              </label>
              <input
                type="text"
                value={newGroup.module}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, module: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="e.g., Calculus 101"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About the Group
              </label>
              <textarea
                value={newGroup.about}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, about: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                rows="2"
                placeholder="Describe the purpose and focus of this study group..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={newGroup.maxParticipants}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, maxParticipants: parseInt(e.target.value) })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Platform
              </label>
              <select
                value={newGroup.meetingPlatform}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, meetingPlatform: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Discord">Discord</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link
              </label>
              <input
                type="text"
                value={newGroup.meetingLink}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, meetingLink: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Paste your meeting link here"
              />
            </div>
          </div>
          <button
            onClick={handleCreateGroup}
            disabled={!newGroup.name || !newGroup.module}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            Create Group
          </button>
        </Card>
      )}

      {/* Group Details Tab */}
      {activeTab === "details" && selectedGroup && (
        <div className="space-y-6">
          {/* Group Header */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                <p className="text-gray-500">
                  {selectedGroup.module} • Owner: {selectedGroup.owner}
                </p>
                <p className="mt-2">{selectedGroup.about}</p>
                <div className="flex items-center mt-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                    {selectedGroup.meetingPlatform}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {selectedGroup.members.length}/{selectedGroup.maxParticipants} members
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleJoin(selectedGroup.id)}
                className={`px-4 py-2 rounded-lg text-white ${
                  selectedGroup.members.includes(currentUser)
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {selectedGroup.members.includes(currentUser) ? "Leave Group" : "Join Group"}
              </button>
            </div>
            
            {/* Meeting Link */}
            {selectedGroup.meetingLink && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Meeting Link</p>
                    <a 
                      href={selectedGroup.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm break-all"
                    >
                      {selectedGroup.meetingLink}
                    </a>
                  </div>
                  <button
                    onClick={() => copyMeetingLink(selectedGroup.meetingLink)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </Card>

          {/* Members Section */}
          <Card title="Members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedGroup.members.map((member) => (
                <div key={member} className="flex items-center p-3 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    {member.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{member}</p>
                    {member === selectedGroup.owner && (
                      <p className="text-xs text-gray-500">Owner</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Study Sessions Section */}
          <Card title="Study Sessions">
            {selectedGroup.sessions.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No study sessions scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {selectedGroup.sessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{session.topic}</h4>
                        <p className="text-sm text-gray-500">
                          {session.date} {session.time && `at ${session.time}`}
                        </p>
                      </div>
                      {selectedGroup.owner === currentUser && (
                        <button
                          onClick={() => removeSession(selectedGroup.id, session.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove session"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {selectedGroup.meetingLink && (
                      <a
                        href={selectedGroup.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Join Session
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {(selectedGroup.owner === currentUser) && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-2">Schedule Study Session</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Session topic"
                    value={newSession.topic}
                    onChange={(e) => setNewSession({...newSession, topic: e.target.value})}
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="p-2 border rounded-lg"
                  />
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                    className="p-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={() => addSession(selectedGroup.id)}
                  disabled={!newSession.topic || !newSession.date}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Schedule Session
                </button>
              </div>
            )}
          </Card>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("browse")}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Back to Groups
            </button>
          </div>
        </div>
      )}
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
