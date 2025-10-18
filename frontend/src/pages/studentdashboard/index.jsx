import React, { useState , useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Minus,
  Trash2,
  X ,
  Filter,
  Edit3 ,
  Heart ,
  MessageCircle,
  ArrowLeft,
  ImagePlus,
  Download,
  User,
  MailIcon,
  BellIcon ,
  PaletteIcon,
  GraduationCapIcon,
  UserIcon,
  LockIcon ,
  SettingsIcon ,
  CameraIcon,
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
// ----------- Dashboard Page ----------- //
function DashboardPage() {
  const [student, setStudent] = useState({
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
    course: "Computer Science",
    year: "3rd Year",
    university: "University of Technology",
    studentId: "UT2021001",
    email: "sarah.j@university.edu",
    joinDate: "September 2021",
    status: "Active"
  });

  const [stats, setStats] = useState({
    studyGroups: 3,
    resources: 12,
    forumPosts: 8,
    upcomingSessions: 2
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "study_group",
      title: "Joined Calculus Study Group",
      description: "You joined the Calculus 101 study group",
      time: "2 hours ago",
      icon: "👥"
    },
    {
      id: 2,
      type: "resource",
      title: "Uploaded Physics Notes",
      description: "You shared Physics Formula Sheet with the community",
      time: "1 day ago",
      icon: "📚"
    },
    {
      id: 3,
      type: "forum",
      title: "Posted in Forum",
      description: "You asked about upcoming workshop schedule",
      time: "2 days ago",
      icon: "💬"
    },
    {
      id: 4,
      type: "session",
      title: "Study Session Completed",
      description: "Attended Web Development study session",
      time: "3 days ago",
      icon: "🎯"
    }
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      title: "Advanced Algorithms Study",
      group: "CS Study Group",
      date: "2024-01-20",
      time: "14:00",
      duration: "2 hours",
      participants: 8
    },
    {
      id: 2,
      title: "Database Systems Review",
      group: "Database Club",
      date: "2024-01-22",
      time: "16:00",
      duration: "1.5 hours",
      participants: 6
    }
  ]);

  const [quickActions, setQuickActions] = useState([
    {
      id: 1,
      title: "Join Study Group",
      description: "Find and join study groups",
      icon: "👥",
      link: "/study-circles",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Upload Resources",
      description: "Share study materials",
      icon: "📚",
      link: "/resources",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Create Post",
      description: "Share updates in forum",
      icon: "💬",
      link: "/forum",
      color: "bg-purple-500"
    },
    {
      id: 4,
      title: "View Schedule",
      description: "Check upcoming sessions",
      icon: "📅",
      link: "/study-circles",
      color: "bg-orange-500"
    }
  ]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {student.name}!
            </h1>
            <p className="text-blue-100">
              Welcome back to your study dashboard. Here's what's happening today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Today is</div>
            <div className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Profile & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <img
                src={student.image}
                alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
              <p className="text-gray-600 mb-1">{student.course} • {student.year}</p>
              <p className="text-sm text-gray-500 mb-4">{student.university}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{student.studentId}</div>
                  <div className="text-gray-500 text-xs">Student ID</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{student.status}</div>
                  <div className="text-gray-500 text-xs">Status</div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm">
                <span className="w-6 text-gray-400">📧</span>
                <span className="text-gray-600">{student.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-6 text-gray-400">📅</span>
                <span className="text-gray-600">Joined {student.joinDate}</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
              Edit Profile
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <a
                  key={action.id}
                  href={action.link}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-600">→</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Stats & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.studyGroups}</div>
                  <div className="text-sm text-gray-500">Study Groups</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.resources}</div>
                  <div className="text-sm text-gray-500">Resources</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.forumPosts}</div>
                  <div className="text-sm text-gray-500">Forum Posts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.upcomingSessions}</div>
                  <div className="text-sm text-gray-500">Upcoming Sessions</div>
                </div>
              </div>
            </div>
          </div>


          {/* Upcoming Study Sessions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Upcoming Study Sessions</h3>
              <p className="text-sm text-gray-500">Your scheduled study sessions</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-xl">📖</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{session.title}</div>
                        <div className="text-sm text-gray-500">{session.group}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(session.date)} • {session.time} • {session.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>👤 {session.participants}</span>
                      </div>
                      <button className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <p>No upcoming study sessions</p>
                  <p className="text-sm">Join a study group to see upcoming sessions</p>
                </div>
              )}
              
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View All Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Study Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Study Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeDasharray="75, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">75%</span>
              </div>
            </div>
            <div className="mt-2 font-medium text-gray-900">Mathematics</div>
            <div className="text-sm text-gray-500">12/16 topics completed</div>
          </div>
          
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="60, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">60%</span>
              </div>
            </div>
            <div className="mt-2 font-medium text-gray-900">Programming</div>
            <div className="text-sm text-gray-500">9/15 topics completed</div>
          </div>
          
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-20 h-20" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="45, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">45%</span>
              </div>
            </div>
            <div className="mt-2 font-medium text-gray-900">Database Systems</div>
            <div className="text-sm text-gray-500">6/13 topics completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ----------- Resources Page ----------- //
function ResourcesPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock database of existing resources
  const mockDatabase = [
    {
      id: 1,
      name: "Calculus Textbook.pdf",
      type: "application/pdf",
      size: 2500000,
      uploadDate: "2023-09-15",
      uploader: "Professor Smith",
      downloads: 142,
      url: "#",
      category: "Mathematics"
    },
    {
      id: 2,
      name: "Physics Formula Sheet.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 180000,
      uploadDate: "2023-10-05",
      uploader: "Dr. Johnson",
      downloads: 89,
      url: "#",
      category: "Physics"
    },
    {
      id: 3,
      name: "Chemistry Lab Report Template.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 95000,
      uploadDate: "2023-09-28",
      uploader: "Lab Assistant",
      downloads: 67,
      url: "#",
      category: "Chemistry"
    },
    {
      id: 4,
      name: "Biology Presentation.pptx",
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      size: 3200000,
      uploadDate: "2023-10-12",
      uploader: "Student Council",
      downloads: 54,
      url: "#",
      category: "Biology"
    },
    {
      id: 5,
      name: "Computer Science Cheat Sheet.pdf",
      type: "application/pdf",
      size: 120000,
      uploadDate: "2023-10-08",
      uploader: "CS Department",
      downloads: 203,
      url: "#",
      category: "Computer Science"
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setDocuments(mockDatabase);
    setFilteredDocuments(mockDatabase);
  }, []);

  // Search and filter functionality
  useEffect(() => {
    const filtered = documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.uploader.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredDocuments(filtered);
  }, [searchQuery, selectedCategory, documents]);

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
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    formData.append("student_id", 1); // replace with actual student ID from auth

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(res.data.message);

      // Refresh the documents list after upload
      const updatedRes = await axios.get("http://localhost:5000/api/resources");
      const docs = updatedRes.data.map(doc => ({
        id: doc.resource_id,
        name: doc.resource_name,
        type: "",
        size: 0,
        uploadDate: doc.uploaded_at,
        uploader: doc.uploader,
        downloads: 0,
        url: `http://localhost:5000/${doc.file_path}`,
        category: "General"
      }));
      setDocuments(docs);
      setFilteredDocuments(docs);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setFilteredDocuments(prev => prev.filter(doc => doc.id !== id));
      alert("File deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  // Handle download
  const handleDownload = (doc) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes('word')) return '';
    if (type.includes('pdf')) return '';
    if (type.includes('excel') || type.includes('spreadsheet')) return '';
    if (type.includes('powerpoint') || type.includes('presentation')) return '';
    return '';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get all unique categories
  const categories = ["all", ...new Set(documents.map(doc => doc.category))];

  return (
    <div className="p-6 space-y-6">
      <Card title="Resources" subtitle="Upload and manage your study materials">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-blue-300 transition-colors">
              <div className="mb-4">
                <FolderOpen size={48} className="mx-auto text-gray-400" />
              </div>
              <h3 className="font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: Word, PDF, Excel, PowerPoint
              </p>
              
              <label className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
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
                  <p className="text-xs text-gray-500 mt-2">Uploading files...</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card title="Resource Library" subtitle="Browse and download study materials">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or uploader..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categories
                      </div>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedCategory === category 
                              ? 'text-blue-600 bg-blue-50' 
                              : 'text-gray-700'
                          }`}
                        >
                          {category === 'all' ? 'All Categories' : category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== 'all') && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Search: "{searchQuery}"
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Category: {selectedCategory}
                      <button 
                        onClick={() => setSelectedCategory("all")}
                        className="ml-2 hover:text-green-600"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredDocuments.length} of {documents.length} resources
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 mb-2">No resources found</p>
                  <p className="text-sm text-gray-400">
                    {searchQuery || selectedCategory !== 'all' 
                      ? "Try adjusting your search or filters" 
                      : "Upload your first file to get started"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{getFileIcon(doc.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {doc.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatFileSize(doc.size)}
                            </span>
                            <span className="text-xs text-gray-500">
                              By {doc.uploader}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(doc.uploadDate)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Download className="w-3 h-3 mr-1" />
                            {doc.downloads} downloads
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        {doc.uploader === "You" && (
                          <button
                            onClick={() => handleDeleteFile(doc.id)}
                            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Storage Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Storage Usage</span>
                  <span className="font-medium">
                    {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))} used
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((documents.reduce((sum, doc) => sum + doc.size, 0) / (100 * 1024 * 1024)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  All files are securely stored and accessible from any device
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}

//====== Forum Page ======//
function ForumPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Welcome to Tech Society!",
      content: "We're excited to announce our first meetup of the semester. Join us for an amazing session on web development and networking with fellow tech enthusiasts.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      author: "Admin User",
      createdAt: "2024-01-15T10:30:00Z",
      likes: 24,
      comments: [
        {
          id: 1,
          studentName: "Sarah Chen",
          studentAvatar: "👩‍💼",
          content: "Excited to join! What time does the meetup start?",
          createdAt: "2024-01-15T11:20:00Z",
          likes: 3
        },
        {
          id: 2,
          studentName: "Mike Johnson",
          studentAvatar: "👨‍💻",
          content: "Great initiative! Looking forward to learning web development with everyone.",
          createdAt: "2024-01-15T12:45:00Z",
          likes: 5
        },
        {
          id: 3,
          studentName: "Emily Davis",
          studentAvatar: "👩‍🎓",
          content: "Will there be any prerequisites for the session?",
          createdAt: "2024-01-15T14:30:00Z",
          likes: 2
        }
      ],
      views: 156,
      status: "published",
      type: "announcement"
    },
    {
      id: 2,
      title: "Upcoming Workshop: React Fundamentals",
      content: "Learn React from scratch in our hands-on workshop this Friday. Bring your laptops and get ready to code!",
      image: null,
      author: "Admin User",
      createdAt: "2024-01-12T14:20:00Z",
      likes: 18,
      comments: [
        {
          id: 1,
          studentName: "Alex Kim",
          studentAvatar: "👨‍🎨",
          content: "Perfect timing! I've been wanting to learn React.",
          createdAt: "2024-01-12T15:10:00Z",
          likes: 4
        },
        {
          id: 2,
          studentName: "Priya Patel",
          studentAvatar: "👩‍🔬",
          content: "What should we install before the workshop?",
          createdAt: "2024-01-12T16:45:00Z",
          likes: 1
        }
      ],
      views: 203,
      status: "published",
      type: "event"
    },
    {
      id: 3,
      title: "Member Spotlight: Sarah Chen",
      content: "This month we're featuring Sarah Chen, who recently built an amazing machine learning project...",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      author: "Admin User",
      createdAt: "2024-01-10T09:15:00Z",
      likes: 32,
      comments: [
        {
          id: 1,
          studentName: "Sarah Chen",
          studentAvatar: "👩‍💼",
          content: "Thank you for featuring me! Happy to share my journey with the community.",
          createdAt: "2024-01-10T10:05:00Z",
          likes: 8
        },
        {
          id: 2,
          studentName: "David Lee",
          studentAvatar: "👨‍💼",
          content: "Inspiring work, Sarah! Could you share more about your project setup?",
          createdAt: "2024-01-10T11:30:00Z",
          likes: 3
        },
        {
          id: 3,
          studentName: "Maria Garcia",
          studentAvatar: "👩‍🏫",
          content: "This is amazing! How long did it take you to complete the project?",
          createdAt: "2024-01-10T13:15:00Z",
          likes: 2
        }
      ],
      views: 189,
      status: "published",
      type: "spotlight"
    }
  ]);

  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit', 'comments'
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Main Flow 1: Create Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image: null,
    type: 'announcement',
    status: 'draft'
  });

  // Filtered posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesType = filterType === 'all' || post.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle input changes and validation
  const handleInputChange = (field, value) => {
    setPostForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Content validation
  const validateContent = () => {
    const errors = [];
    
    if (!postForm.title.trim()) {
      errors.push('Title is required');
    }
    
    if (!postForm.content.trim()) {
      errors.push('Content is required');
    }
    
    if (postForm.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    
    if (postForm.content.length > 1000) {
      errors.push('Content must be less than 1000 characters');
    }
    
    // Check for inappropriate content (basic example)
    const inappropriateWords = ['spam', 'inappropriate', 'badword'];
    const content = postForm.title + ' ' + postForm.content;
    if (inappropriateWords.some(word => content.toLowerCase().includes(word))) {
      errors.push('Content contains inappropriate language');
    }
    
    return errors;
  };

  // Save post
  const handleSavePost = async (e) => {
    e.preventDefault();
    
    const errors = validateContent();
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n${errors.join('\n')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost = {
      id: selectedPost ? selectedPost.id : Date.now(),
      title: postForm.title,
      content: postForm.content,
      image: postForm.image,
      author: "Admin User",
      createdAt: selectedPost ? selectedPost.createdAt : new Date().toISOString(),
      likes: selectedPost ? selectedPost.likes : 0,
      comments: selectedPost ? selectedPost.comments : [],
      views: selectedPost ? selectedPost.views : 0,
      status: postForm.status,
      type: postForm.type
    };
    
    if (selectedPost) {
      // Update existing post
      setPosts(posts.map(post => post.id === selectedPost.id ? newPost : post));
    } else {
      // Add new post
      setPosts([newPost, ...posts]);
    }
    
    // Reset form and return to list view
    setPostForm({
      title: '',
      content: '',
      image: null,
      type: 'announcement',
      status: 'draft'
    });
    setSelectedPost(null);
    setViewMode('list');
    setIsSubmitting(false);
    
    console.log(`Post ${selectedPost ? 'updated' : 'created'} - Audit log recorded`);
  };

  // Edit post
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      image: post.image,
      type: post.type,
      status: post.status
    });
    setViewMode('edit');
  };

  // Delete post
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      setPosts(posts.filter(post => post.id !== postId));
      console.log(`Post ${postId} deleted - Audit log recorded`);
    }
  };

  // View comments
  const handleViewComments = (post) => {
    setSelectedPost(post);
    setViewMode('comments');
  };

  // Add comment
  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      studentName: "Current User",
      studentAvatar: "👤",
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: [...post.comments, comment]
          }
        : post
    ));
    
    setNewComment('');
    console.log(`Comment added to post ${postId} - Audit log recorded`);
  };

  // Delete comment
  const handleDeleteComment = (postId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setPosts(posts.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            }
          : post
      ));
      console.log(`Comment ${commentId} deleted from post ${postId} - Audit log recorded`);
    }
  };

  // Like post
  const handleLikePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  // Like comment
  const handleLikeComment = (postId, commentId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments: post.comments.map(comment =>
              comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            )
          }
        : post
    ));
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostForm(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format relative time for comments
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  // Comments View
  if (viewMode === 'comments' && selectedPost) {
    return (
      <Card
        title="Post Comments"
        subtitle={`Managing comments for: ${selectedPost.title}`}
      >
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Posts
          </button>

          {/* Post Summary */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{selectedPost.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{selectedPost.content}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{selectedPost.likes} likes</span>
              <span>{selectedPost.comments.length} comments</span>
              <span>{selectedPost.views} views</span>
            </div>
          </div>

          {/* Add Comment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h4 className="font-medium text-gray-900 mb-3">Add a Comment</h4>
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                onClick={() => handleAddComment(selectedPost.id)}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({selectedPost.comments.length})
            </h3>
            
            {selectedPost.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>No comments yet</p>
                <p className="text-sm">Be the first to comment on this post</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{comment.studentAvatar}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{comment.studentName}</div>
                          <div className="text-xs text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                          className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                        >
                          <Heart size={14} />
                          {comment.likes}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Create/Edit Post View
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <Card
        title={viewMode === 'create' ? "Create New Post" : "Edit Post"}
        subtitle={viewMode === 'create' ? "Share updates and announcements with society members" : `Editing: ${selectedPost?.title}`}
      >
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedPost(null);
              setPostForm({
                title: '',
                content: '',
                image: null,
                type: 'announcement',
                status: 'draft'
              });
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Posts
          </button>

          <form onSubmit={handleSavePost} className="space-y-6">
            {/* Post Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                <select
                  value={postForm.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="spotlight">Member Spotlight</option>
                  <option value="news">News</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={postForm.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm text-sm"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {postForm.title.length}/100 characters
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={postForm.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your post content here..."
                rows={8}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm text-sm resize-none"
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {postForm.content.length}/1000 characters
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  <ImagePlus size={16} />
                  {postForm.image ? 'Change Image' : 'Upload Image'}
                </label>
                {postForm.image && (
                  <div className="relative">
                    <img
                      src={postForm.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image', null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setViewMode('list');
                  setSelectedPost(null);
                  setPostForm({
                    title: '',
                    content: '',
                    image: null,
                    type: 'announcement',
                    status: 'draft'
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? 'Saving...' : (viewMode === 'create' ? 'Create Post' : 'Update Post')}
              </button>
            </div>
          </form>
        </div>
      </Card>
    );
  }

  // Main Posts List View
  return (
    <Card
      title="Forum"
      subtitle="Create and manage society posts, announcements, and updates"
    >
      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 outline-none placeholder:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus size={16} />
            Create Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Types</option>
            <option value="announcement">Announcement</option>
            <option value="event">Event</option>
            <option value="spotlight">Spotlight</option>
            <option value="news">News</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-lg font-medium text-gray-900 mb-2">No posts yet</div>
          <p className="text-gray-600 mb-4">Create your first post to share updates with society members</p>
          <button
            onClick={() => setViewMode('create')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Create First Post
          </button>
        </div>
      ) : (
        /* Posts Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {/* Post Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    post.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                    post.type === 'event' ? 'bg-green-100 text-green-800' :
                    post.type === 'spotlight' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.type}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>by {post.author}</span>
                </div>
                
                {/* Engagement Metrics */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Heart size={12} />
                      {post.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {post.comments.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.views}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-xs"
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewComments(post)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                  >
                    <MessageCircle size={12} />
                    Comments
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-xs"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>

                {/* Recent Comments Preview */}
                {post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-700 mb-2">Recent Comments:</div>
                    <div className="space-y-2">
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2 text-xs">
                          <div className="text-lg">{comment.studentAvatar}</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{comment.studentName}</div>
                            <div className="text-gray-600 line-clamp-1">{comment.content}</div>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{post.comments.length - 2} more comments
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty Search Results */}
      {filteredPosts.length === 0 && posts.length > 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-sm font-medium mb-2">No posts found</div>
          <p className="text-xs">Try adjusting your search terms or filters</p>
        </div>
      )}
    </Card>
  );
}


// ---------- Settings Page ----------

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [errors, setErrors] = useState({});

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "Student",
    lastName: "Name",
    bio: "Computer Science student passionate about technology and innovation.",
    university: "University of Technology",
    course: "Computer Science",
    yearOfStudy: "3",
    address: "123 University Ave, Campus Town",
  });

  const [accountForm, setAccountForm] = useState({
    email: "student@university.edu",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    eventUpdates: true,
    theme: "light",
  });

  // ---------- Handlers ----------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      setPreview(URL.createObjectURL(file));
      setPreviewFile(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAccountChange = (field, value) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- Validations ----------
  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profileForm.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!profileForm.university.trim()) newErrors.university = "University is required";
    if (!profileForm.course.trim()) newErrors.course = "Course is required";
    if (profileForm.bio.length > 200) newErrors.bio = "Bio must be less than 200 characters";
    return newErrors;
  };

  const validateAccount = () => {
    const newErrors = {};
    if (!accountForm.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(accountForm.email)) newErrors.email = "Email is invalid";
    if (accountForm.newPassword) {
      if (accountForm.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
      if (accountForm.newPassword !== accountForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!accountForm.currentPassword) newErrors.currentPassword = "Current password is required to change password";
    }
    return newErrors;
  };

  // ---------- Save Functions ----------
  const handleSaveProfile = async () => {
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSaveStatus("saving");

    try {
      const formData = new FormData();
      Object.entries(profileForm).forEach(([key, value]) => formData.append(key, value));
      if (previewFile) formData.append("profile_image", previewFile);

      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:3000/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSaveStatus("saved");
      setErrors({});
      if (response.data.profile_image && previewFile) {
        setPreview(URL.createObjectURL(previewFile));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleSaveAccount = async () => {
    const validationErrors = validateAccount();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSaveStatus("saving");

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("saved");
      setErrors({});
      setAccountForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update account" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setSaveStatus("saving");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleResetForm = () => {
    setProfileForm({
      firstName: "Student",
      lastName: "Name",
      bio: "Computer Science student passionate about technology and innovation.",
      university: "University of Technology",
      course: "Computer Science",
      yearOfStudy: "3",
      address: "123 University Ave, Campus Town",
    });
    setPreview(null);
    setPreviewFile(null);
    setErrors({});
  };

  const getSaveButtonText = () => {
    if (isLoading) return "Saving...";
    if (saveStatus === "saved") return "✓ Saved";
    return "Save Changes";
  };

  // ---------- Render ----------
  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your profile and account preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 bg-gray-50 rounded-t-lg p-1 mx-6 mt-6">
          {[
            { id: "profile", label: "Profile", icon: UserIcon },
            { id: "account", label: "Account", icon: LockIcon },
            { id: "preferences", label: "Preferences", icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div
            className={`mx-6 mt-4 p-3 rounded-lg text-sm font-medium ${
              saveStatus === "saved"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {saveStatus === "saved" ? "✓ Changes saved successfully" : "⏳ Saving changes..."}
          </div>
        )}

        <div className="p-6">
          {/* ---------- Profile Tab ---------- */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-2xl bg-white">
                <div className="relative">
                  <img
                    src={preview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                    <CameraIcon className="w-5 h-5" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileForm.firstName} {profileForm.lastName}
                  </h2>
                  <p className="text-gray-600 mb-2">{profileForm.course} Student</p>
                  <p className="text-sm text-gray-500">{profileForm.university}</p>
                  <div className="flex gap-2 mt-3">
                    <label className="cursor-pointer">
                      <span className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                        Upload New Photo
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setPreviewFile(null);
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal & Study Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <div className="bg-white p-6 border border-gray-200 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserIcon className="w-5 h-5" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          value={profileForm.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="First Name"
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          value={profileForm.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Last Name"
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          rows={3}
                          value={profileForm.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                            errors.bio ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Brief description about yourself</span>
                          <span>{profileForm.bio.length}/200</span>
                        </div>
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Study Info */}
                <div className="space-y-4">
                  <div className="bg-white p-6 border border-gray-200 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCapIcon className="w-5 h-5" /> Study Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                        <input
                          value={profileForm.university}
                          onChange={(e) => handleProfileChange("university", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.university ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="University"
                        />
                        {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                        <input
                          value={profileForm.course}
                          onChange={(e) => handleProfileChange("course", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.course ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Course"
                        />
                        {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                          <select
                            value={profileForm.yearOfStudy}
                            onChange={(e) => handleProfileChange("yearOfStudy", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            {[1, 2, 3, 4, 5].map((year) => (
                              <option key={year} value={year}>
                                Year {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <input
                            value={profileForm.address}
                            onChange={(e) => handleProfileChange("address", e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {getSaveButtonText()}
                </button>
                <button
                  onClick={handleResetForm}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* ---------- Account Tab ---------- */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="bg-white p-6 border border-gray-200 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MailIcon className="w-5 h-5" /> Email & Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => handleAccountChange("email", e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={accountForm.currentPassword}
                          onChange={(e) => handleAccountChange("currentPassword", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.currentPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter current password"
                        />
                        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={accountForm.newPassword}
                          onChange={(e) => handleAccountChange("newPassword", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.newPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter new password"
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={accountForm.confirmPassword}
                          onChange={(e) => handleAccountChange("confirmPassword", e.target.value)}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveAccount}
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {getSaveButtonText()}
                  </button>
                  <button
                    onClick={() =>
                      setAccountForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
                    }
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                  >
                    Clear Passwords
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Preferences Tab ---------- */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="bg-white p-6 border border-gray-200 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" /> Preferences
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Email Notifications", field: "emailNotifications" },
                    { label: "Push Notifications", field: "pushNotifications" },
                    { label: "Study Reminders", field: "studyReminders" },
                    { label: "Event Updates", field: "eventUpdates" },
                  ].map((pref) => (
                    <div key={pref.field} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={preferences[pref.field]}
                        onChange={(e) => handlePreferenceChange(pref.field, e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <label>{pref.label}</label>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSavePreferences}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {getSaveButtonText()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ----------- Study Circle Page -----------
function StudyCirclePage() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    joinedOnly: false,
    ownedOnly: false,
    withSlots: false
  });
  const [newGroup, setNewGroup] = useState({
    group_name: "",
    module_name: "",
    about: "",
    num_members: 8,
    meeting_link: "",
    meeting_platform: "Microsoft Teams",
    meeting_date: "",
    meeting_time: ""
  });
  const [editGroup, setEditGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [myGroups, setMyGroups] = useState([]);

  // API Base URL
  const API_BASE_URL = 'http://localhost:3000/api/study-groups';

  // Debug localStorage
  const debugLocalStorage = () => {
    console.log('🔍 localStorage contents:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      allItems: { ...localStorage }
    });
  };

  // Get authentication token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log("🔐 Token retrieval:", {
      exists: !!token,
      length: token?.length,
      firstChars: token ? token.substring(0, 20) + '...' : 'none'
    });
    return token;
  };

  // Get current user from token
  const getCurrentUser = () => {
    console.log('🔄 Getting current user...');
    
    // Method 1: Try to get from localStorage user object first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('✅ User from localStorage:', user);
        return user;
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
      }
    }
    
    // Method 2: Decode from JWT token
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('✅ User from JWT payload:', payload);
        
        const user = {
          id: payload.id,
          name: payload.name,
          role: payload.role
        };
        
        // Store for future use
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.error('❌ Error decoding token:', error);
      }
    }
    
    console.log('❌ No user found');
    return null;
  };

  // API Headers
  const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('📤 Adding Authorization header with token');
    } else {
      console.warn('⚠️ No token available for Authorization header');
    }
    
    return headers;
  };

  // Enhanced fetch with better error handling
  const apiFetch = async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    console.log(`🌐 API Call: ${options.method || 'GET'} ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: getHeaders()
      });
      
      console.log(`📨 Response: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed - 401 Unauthorized');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        return null;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  };

  // Test authentication
  const testAuthentication = async () => {
    try {
      console.log('🧪 Testing authentication...');
      const response = await apiFetch('/debug-auth');
      if (response) {
        const result = await response.json();
        console.log('✅ Authentication test successful:', result);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      return false;
    }
  };

  // Fetch all groups
  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching all groups...');
      
      const response = await apiFetch('/all');
      if (!response) {
        console.error('❌ Cannot fetch groups - authentication failed');
        return;
      }
      
      const result = await response.json();
      console.log('✅ All groups response:', result);
      
      if (result.success) {
        setGroups(result.data || []);
        console.log(`✅ Loaded ${result.data?.length || 0} groups`);
      } else {
        console.error('❌ Failed to fetch groups:', result.message);
      }
    } catch (error) {
      console.error('❌ Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my groups
  const fetchMyGroups = async () => {
    try {
      console.log('🔄 Fetching my groups...');
      
      const response = await apiFetch('/my-groups');
      if (!response) return;
      
      const result = await response.json();
      console.log('✅ My groups response:', result);
      
      if (result.success) {
        setMyGroups(result.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching my groups:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🚀 StudyCirclePage mounted');
    debugLocalStorage();
    
    const initializeApp = async () => {
      const user = getCurrentUser();
      console.log('👤 Initial user:', user);
      
      if (user) {
        setCurrentUser(user);
        
        // Test authentication first
        const isAuthenticated = await testAuthentication();
        if (isAuthenticated) {
          await fetchAllGroups();
          await fetchMyGroups();
        } else {
          setLoading(false);
          console.error('❌ Authentication test failed');
        }
      } else {
        setLoading(false);
        console.error('❌ No user found - please log in');
      }
    };

    initializeApp();
  }, []);

  // Add a refresh button for testing
  const handleRefresh = async () => {
    console.log('🔄 Manual refresh...');
    debugLocalStorage();
    
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setLoading(true);
      await fetchAllGroups();
      await fetchMyGroups();
    }
  };

  // Filter groups based on search and filters
  const filteredGroups = groups.filter((g) => {
    if (!currentUser) return false;
    
    const matchesSearch = [g.group_name, g.module_name, g.about].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    );
    
    const matchesJoined = filters.joinedOnly ? g.members?.includes(currentUser.name) : true;
    const matchesOwned = filters.ownedOnly ? g.user_id === currentUser.id : true;
    const matchesSlots = filters.withSlots ? (g.members?.length || 0) < g.num_members : true;
    
    return matchesSearch && matchesJoined && matchesOwned && matchesSlots;
  });

  // Validation function
  const validateGroup = (group) => {
    const newErrors = {};
    
    if (!group.group_name?.trim()) {
      newErrors.group_name = "Group name is required";
    }
    
    if (!group.module_name?.trim()) {
      newErrors.module_name = "Module name is required";
    }
    
    if (!group.meeting_date) {
      newErrors.meeting_date = "Date is required";
    }
    
    if (!group.meeting_link?.trim()) {
      newErrors.meeting_link = "Meeting link is required";
    }
    
    if (group.num_members < 2 || group.num_members > 20) {
      newErrors.num_members = "Number of members must be between 2 and 20";
    }
    
    return newErrors;
  };

  // Create a new group
  const handleCreateGroup = async () => {
    const validationErrors = validateGroup(newGroup);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log('🔄 Creating new group...', newGroup);
      
      const response = await apiFetch('', {
        method: 'POST',
        body: JSON.stringify(newGroup)
      });

      if (!response) return;

      const result = await response.json();
      console.log('✅ Create group response:', result);
      
      if (result.success) {
        await fetchAllGroups();
        await fetchMyGroups();
        
        setNewGroup({ 
          group_name: "", 
          module_name: "", 
          about: "", 
          num_members: 8,
          meeting_link: "",
          meeting_platform: "Microsoft Teams",
          meeting_date: "",
          meeting_time: ""
        });
        setErrors({});
        setShowCreateModal(false);
        alert('✅ Study group created successfully!');
      } else {
        alert(`❌ Failed to create group: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error creating group:', error);
      alert('❌ Failed to create study group. Please try again.');
    }
  };

  // Edit a group
  const handleEditGroup = async () => {
    if (!editGroup) return;
    
    const validationErrors = validateGroup(editGroup);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log('🔄 Updating group...', editGroup);
      
      const response = await apiFetch(`/${editGroup.id}`, {
        method: 'PUT',
        body: JSON.stringify(editGroup)
      });

      if (!response) return;

      const result = await response.json();
      console.log('✅ Update group response:', result);
      
      if (result.success) {
        await fetchAllGroups();
        await fetchMyGroups();
        
        setEditGroup(null);
        setErrors({});
        setShowEditModal(false);
        alert('✅ Study group updated successfully!');
      } else {
        alert(`❌ Failed to update group: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error updating group:', error);
      alert('❌ Failed to update study group. Please try again.');
    }
  };

  // Delete a group
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        console.log('🔄 Deleting group...', groupId);
        
        const response = await apiFetch(`/${groupId}`, {
          method: 'DELETE'
        });

        if (!response) return;

        const result = await response.json();
        console.log('✅ Delete group response:', result);
        
        if (result.success) {
          await fetchAllGroups();
          await fetchMyGroups();
          
          if (selectedGroup?.id === groupId) {
            setShowDetailsModal(false);
          }
          
          alert('✅ Study group deleted successfully!');
        } else {
          alert(`❌ Failed to delete group: ${result.message}`);
        }
      } catch (error) {
        console.error('❌ Error deleting group:', error);
        alert('❌ Failed to delete study group. Please try again.');
      }
    }
  };

  // Join a group
  const joinGroup = async (groupId) => {
    try {
      const response = await apiFetch(`/${groupId}/join`, {
        method: 'POST'
      });

      if (!response) return;

      const result = await response.json();
      if (result.success) {
        await fetchAllGroups();
        await fetchMyGroups();
        alert('✅ Successfully joined the group!');
      } else {
        alert(`❌ Failed to join group: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error joining group:', error);
      alert('❌ Failed to join group. Please try again.');
    }
  };

  // Leave a group
  const leaveGroup = async (groupId) => {
    try {
      const response = await apiFetch(`/${groupId}/leave`, {
        method: 'POST'
      });

      if (!response) return;

      const result = await response.json();
      if (result.success) {
        await fetchAllGroups();
        await fetchMyGroups();
        alert('✅ Successfully left the group!');
      } else {
        alert(`❌ Failed to leave group: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error leaving group:', error);
      alert('❌ Failed to leave group. Please try again.');
    }
  };

  // Toggle join/unjoin a group
  const toggleJoin = async (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    const isMember = group.members?.includes(currentUser.name);
    
    if (!isMember && (group.members?.length || 0) >= group.num_members) {
      alert("❌ This group is already full.");
      return;
    }

    if (isMember) {
      await leaveGroup(groupId);
    } else {
      await joinGroup(groupId);
    }
  };

  // View group details
  const viewGroupDetails = (group) => {
    setSelectedGroup(group);
    setShowDetailsModal(true);
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("✅ Meeting link copied to clipboard!");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Debug info
  console.log("🔍 Current state:", {
    currentUser,
    loading,
    groupsCount: groups.length,
    myGroupsCount: myGroups.length,
    filteredGroupsCount: filteredGroups.length,
    hasToken: !!getAuthToken()
  });

  // Modal Component
  const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Card Component
  const Card = ({ children, title, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-md p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );

  if (!currentUser) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64 flex-col space-y-4">
        <div className="text-lg text-red-600">Please log in to view study groups</div>
        <div className="text-sm text-gray-500">No valid user token found</div>
        
        {/* Debug information */}
        <div className="bg-gray-100 p-4 rounded-lg text-xs">
          <div>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</div>
          <div>User data: {localStorage.getItem('user') || 'None'}</div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Login
          </button>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Refresh
          </button>
          <button 
            onClick={debugLocalStorage}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Debug Storage
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-lg">Loading study groups...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with debug button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Study Circles</h1>
          <p className="text-gray-600">Find or manage your study groups</p>
          <p className="text-sm text-gray-500">Welcome, {currentUser.name} (ID: {currentUser.id})</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus size={16} />
            Create Group
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by group name, module, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.joinedOnly}
                    onChange={(e) => setFilters({...filters, joinedOnly: e.target.checked})}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Joined Groups Only
                </label>
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ownedOnly}
                    onChange={(e) => setFilters({...filters, ownedOnly: e.target.checked})}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  My Groups Only
                </label>
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.withSlots}
                    onChange={(e) => setFilters({...filters, withSlots: e.target.checked})}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  With Available Slots
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredGroups.length} of {groups.length} groups
        </div>
      </Card>

      {/* My Study Groups Table */}
      {myGroups.length > 0 && (
        <Card title="My Study Groups">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Group Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myGroups.map((group, index) => (
                  <tr 
                    key={group.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-25' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{group.about}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{group.module_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatDate(group.meeting_date)} {group.meeting_time && `at ${group.meeting_time}`}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {group.members?.length || 0}/{group.num_members}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {group.meeting_platform}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditGroup({...group});
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit group"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => viewGroupDetails(group)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete group"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* All Study Groups */}
      <Card title="All Study Groups">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-lg font-medium text-gray-900 mb-2">No groups found</div>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus size={16} />
              Create First Group
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Group name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group, index) => (
                  <tr 
                    key={group.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-25' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{group.about}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{group.module_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatDate(group.meeting_date)} {group.meeting_time && `at ${group.meeting_time}`}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{group.owner || "Unknown"}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {group.members?.length || 0}/{group.num_members}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {group.meeting_platform}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewGroupDetails(group)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => toggleJoin(group.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            group.members?.includes(currentUser.name)
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={group.members?.includes(currentUser.name) ? "Leave group" : "Join group"}
                        >
                          {group.members?.includes(currentUser.name) ? <Minus size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => {setShowCreateModal(false); setErrors({});}} title="Create New Study Group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={newGroup.group_name}
              onChange={(e) => setNewGroup({ ...newGroup, group_name: e.target.value })}
              className={`w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none ${
                errors.group_name ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="e.g., Advanced Calculus Study Group"
            />
            {errors.group_name && <p className="text-red-500 text-xs mt-1">{errors.group_name}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Name *
            </label>
            <input
              type="text"
              value={newGroup.module_name}
              onChange={(e) => setNewGroup({ ...newGroup, module_name: e.target.value })}
              className={`w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none ${
                errors.module_name ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="e.g., Calculus 101"
            />
            {errors.module_name && <p className="text-red-500 text-xs mt-1">{errors.module_name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={newGroup.meeting_date}
              onChange={(e) => setNewGroup({ ...newGroup, meeting_date: e.target.value })}
              className={`w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none ${
                errors.meeting_date ? 'ring-2 ring-red-500' : ''
              }`}
            />
            {errors.meeting_date && <p className="text-red-500 text-xs mt-1">{errors.meeting_date}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              value={newGroup.meeting_time}
              onChange={(e) => setNewGroup({ ...newGroup, meeting_time: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Members *
            </label>
            <input
              type="number"
              min="2"
              max="20"
              value={newGroup.num_members}
              onChange={(e) => setNewGroup({ ...newGroup, num_members: parseInt(e.target.value) || 2 })}
              className={`w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none ${
                errors.num_members ? 'ring-2 ring-red-500' : ''
              }`}
            />
            {errors.num_members && <p className="text-red-500 text-xs mt-1">{errors.num_members}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Platform *
            </label>
            <select
              value={newGroup.meeting_platform}
              onChange={(e) => setNewGroup({ ...newGroup, meeting_platform: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none"
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
              Meeting Link *
            </label>
            <input
              type="text"
              value={newGroup.meeting_link}
              onChange={(e) => setNewGroup({ ...newGroup, meeting_link: e.target.value })}
              className={`w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none ${
                errors.meeting_link ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Paste your meeting link here"
            />
            {errors.meeting_link && <p className="text-red-500 text-xs mt-1">{errors.meeting_link}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About the Group
            </label>
            <textarea
              value={newGroup.about}
              onChange={(e) => setNewGroup({ ...newGroup, about: e.target.value })}
              className="w-full p-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none"
              rows="3"
              placeholder="Describe the purpose and focus of this study group..."
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={() => {setShowCreateModal(false); setErrors({});}}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Group
          </button>
        </div>
      </Modal>

      {/* Rest of your modals (Edit, Details) would go here with similar API integration */}
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
