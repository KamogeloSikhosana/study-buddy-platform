import React, { useState , useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
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
  ChevronLeft ,
  Menu ,
  CameraIcon,
   Calendar, 
  Clock, 
  MoreVertical, 
  CheckCircle,
  Circle,
  AlertCircle
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
function Sidebar({ page, setPage, onLogout, isOpen, onToggle }) {
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "study-circle", label: "Study Sessions", icon: <BookOpen size={18} /> },
    { key: "resources", label: "Resources", icon: <FolderOpen size={18} /> },
    { key: "scheduler", label: "Scheduler", icon: <Calendar size={18} /> },
    { key: "forum", label: "Forum", icon: <MessageSquare size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar - Sticky and Full Height */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:h-screen
      `}>
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Header with bigger logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <img src="/src/assets/logo.png" alt="StudyBuddy logo" className="h-35 w-auto" /> {/* Bigger logo */}
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded hover:bg-blue-50 text-blue-600"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Navigation - Takes remaining space */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {nav.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setPage(item.key);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                  page === item.key
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <div className={`flex-shrink-0 ${page === item.key ? 'text-white' : 'text-blue-500'}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer - Moved up with margin top */}
          <div className="mt-auto p-3 border-t border-gray-200"> {/* mt-auto pushes it up */}
            <div className="mb-3 p-3 rounded-lg bg-blue-50">
              <div className="text-xs text-blue-600 opacity-80 mb-1">Logged in as</div>
              <div className="text-sm font-semibold text-blue-800">Student</div>
              <div className="text-xs text-blue-600 opacity-70">Taras Migulko</div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button - shows when sidebar is hidden */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-3 left-3 z-50 lg:hidden p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          <Menu size={16} />
        </button>
      )}
    </>
  );
}


//======== TASK SCHEDULER =======//
function TaskScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    type: "TASK",
    priority: "MEDIUM",
    date: new Date().toISOString().split('T')[0],
    time: "12:00",
    description: ""
  });

  const { user } = useAuth();

  // Use absolute URL to avoid proxy issues
  const API_BASE_URL = 'http://localhost:3000';

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Error fetching tasks: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions for calendar
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Fixed date functions - use local timezone
  const getTodayTasks = () => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    return tasks.filter(task => {
      const taskDate = new Date(task.date).toLocaleDateString('en-CA');
      return taskDate === today;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date().toLocaleDateString('en-CA');
    return tasks
      .filter(task => {
        const taskDate = new Date(task.date).toLocaleDateString('en-CA');
        return taskDate >= today && !task.completed;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${API_BASE_URL}/api/tasks`, newTask, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setTasks([...tasks, response.data.data]);
        setNewTask({
          title: "",
          type: "TASK",
          priority: "MEDIUM",
          date: new Date().toISOString().split('T')[0],
          time: "12:00",
          description: ""
        });
        setShowAddTaskForm(false);
        alert('Task created successfully!');
        
        // Refresh tasks list
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Error creating task: ${errorMessage}`);
    }
  };

  const toggleTaskCompletion = async (taskId) => {
    try {
      const task = tasks.find(t => t.task_id === taskId);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        completed: !task.completed
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTasks(tasks.map(task => 
          task.task_id === taskId ? { ...task, completed: !task.completed } : task
        ));
        
        // Show success message and close modal
        alert(`✓ Task marked as ${!task.completed ? 'completed' : 'incomplete'} successfully!`);
        setSelectedTask(null); // Close the modal
      }
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Error updating task: ${errorMessage}`);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTasks(tasks.filter(task => task.task_id !== taskId));
        setSelectedTask(null);
        alert('Task deleted successfully!');
        
        // Refresh tasks list
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`Error deleting task: ${errorMessage}`);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "HIGH":
        return <AlertCircle size={14} className="text-red-500" />;
      case "MEDIUM":
        return <AlertCircle size={14} className="text-yellow-500" />;
      case "LOW":
        return <AlertCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "MEETING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CALLBACK":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "TASK":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get calendar task color based on type
  const getCalendarTaskColor = (task) => {
    switch (task.type) {
      case "MEETING":
        return "bg-blue-500 text-white border-blue-600";
      case "CALLBACK":
        return "bg-purple-500 text-white border-purple-600";
      case "TASK":
      default:
        return "bg-red-500 text-white border-red-600";
    }
  };

  // Generate calendar days - fixed timezone issue
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
        isCurrentMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true
      });
    }
    
    // Next month's days
    const totalCells = 42; // 6 weeks
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    for (let i = 1; days.length < totalCells; i++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Fixed today's date - use local timezone
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const todayCalendar = today.toDateString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Scheduling</h1>
          <p className="text-gray-600 text-sm">Manage your tasks, meetings, and callbacks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Calendar & Today's Tasks */}
          <div className="lg:col-span-2 space-y-4">
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-900">Calendar</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <span className="text-base font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-gray-100 rounded-lg transform rotate-180 text-sm"
                  >
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  const dateString = day.date.toLocaleDateString('en-CA');
                  const dayTasks = tasks.filter(task => {
                    const taskDate = new Date(task.date).toLocaleDateString('en-CA');
                    return taskDate === dateString;
                  });
                  const isToday = day.date.toDateString() === todayCalendar;
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-16 p-1 rounded-lg border flex flex-col ${
                        day.isCurrentMonth 
                          ? isToday 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white'
                          : 'border-transparent bg-gray-50'
                      } ${!day.isCurrentMonth ? 'text-gray-400' : ''}`}
                    >
                      <div className="text-xs font-medium mb-1">
                        {day.date.getDate()}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        {dayTasks.slice(0, 2).map((task, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-0.5 rounded ${getCalendarTaskColor(task)}`}
                          >
                            <div className="truncate font-medium">{task.title}</div>
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="mb-3">
                <h2 className="font-semibold text-gray-900 text-base">Today</h2>
                <p className="text-gray-600 text-xs">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="space-y-2">
                {getTodayTasks().map(task => (
                  <div
                    key={task.task_id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      task.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleTaskCompletion(task.task_id)}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <Circle size={16} className="text-gray-400" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${getTypeColor(task.type)}`}>
                            {task.type.toLowerCase()}
                          </span>
                          {getPriorityIcon(task.priority)}
                        </div>
                        <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{task.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                ))}
                {getTodayTasks().length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <Calendar size={32} className="mx-auto mb-1 opacity-50" />
                    <p>No tasks scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Tasks & Add Task Button */}
          <div className="space-y-4">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="mb-3">
                <h2 className="font-semibold text-gray-900 text-base">Upcoming Tasks</h2>
                <p className="text-gray-600 text-xs">{getUpcomingTasks().length} upcoming items</p>
              </div>
              <div className="space-y-2">
                {getUpcomingTasks().map(task => (
                  <div
                    key={task.task_id}
                    className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar size={10} />
                          <span>{new Date(task.date).toLocaleDateString()}</span>
                          <Clock size={10} />
                          <span>{task.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                ))}
                {getUpcomingTasks().length === 0 && (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    <p>No upcoming tasks</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setShowAddTaskForm(true)}
              className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 flex items-center justify-center space-x-1 transition-colors text-sm"
            >
              <Plus size={16} />
              <span className="font-medium">Add New Task</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchTasks}
              className="w-full bg-gray-500 text-white py-1.5 px-3 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Refresh Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Form Modal */}
      {showAddTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Add New Task</h3>
              <button
                onClick={() => setShowAddTaskForm(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="TASK">Task</option>
                    <option value="MEETING">Meeting</option>
                    <option value="CALLBACK">Call Back</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter task description"
                  rows="2"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setShowAddTaskForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTask.title.trim()}
                  className="flex-1 bg-blue-500 text-white py-1.5 px-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Task Details</h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{selectedTask.title}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getTypeColor(selectedTask.type)}`}>
                    {selectedTask.type.toLowerCase()}
                  </span>
                  {getPriorityIcon(selectedTask.priority)}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Calendar size={14} />
                <span>{new Date(selectedTask.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <Clock size={14} />
                <span>{selectedTask.time}</span>
              </div>

              {selectedTask.description && (
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Description</h5>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    {selectedTask.description}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2 pt-3">
                <button
                  onClick={() => toggleTaskCompletion(selectedTask.task_id)}
                  className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  {selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => deleteTask(selectedTask.task_id)}
                  className="flex-1 bg-red-100 text-red-700 py-1.5 px-3 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------- Pages ----------- //
function DashboardPage() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    studyGroups: 0,
    resources: 0,
    forumPosts: 0,
    upcomingSessions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch student data and dashboard stats
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      console.log("🔍 Fetching dashboard data for user:", user);

      if (!user || !user.id) {
        console.error("❌ No user data available");
        setError("No user data available");
        setLoading(false);
        return;
      }

      // Try multiple endpoints to find the correct one
      let studentResponse;

      // First try: Get current user's profile
      try {
        studentResponse = await axios.get(`http://localhost:3000/api/students/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Profile me endpoint success:", studentResponse.data);
      } catch (profileError) {
        console.log("❌ Profile me endpoint failed, trying by ID...");
        
        // Second try: Get student by ID
        try {
          studentResponse = await axios.get(`http://localhost:3000/api/students/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("✅ Student by ID endpoint success:", studentResponse.data);
        } catch (idError) {
          console.log("❌ Both endpoints failed, using fallback data");
          setError("Failed to fetch student data from server");
          throw new Error("All student endpoints failed");
        }
      }

      if (studentResponse.data.success) {
        console.log("📊 Setting student data:", studentResponse.data.data);
        setStudent(studentResponse.data.data);
      } else {
        throw new Error("Student API returned unsuccessful response");
      }

      // Fetch other data (resources, study groups, etc.)
      await fetchOtherData(token);

    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      // Fallback to mock data
      setStudent({
        name: user?.name || "Student Name",
        email: user?.email || "student@university.edu",
        course: "Computer Science",
        year: "3rd Year",
        university: "University of Technology",
        joinDate: "September 2021",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
        bio: "Computer Science student passionate about technology and innovation.",
        address: "123 University Ave, Campus Town"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherData = async (token) => {
    try {
      // Fetch resources count
      const resourcesResponse = await axios.get("http://localhost:3000/api/resources/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resourcesResponse.data.success) {
        const userResources = resourcesResponse.data.data.filter(
          resource => resource.student_id === user?.id
        );
        setStats(prev => ({
          ...prev,
          resources: userResources.length
        }));
      }
    } catch (resourcesError) {
      console.error("Error fetching resources:", resourcesError);
      setStats(prev => ({ ...prev, resources: 5 })); // Default value
    }

    // Set default values for other stats
    setStats(prev => ({
      ...prev,
      studyGroups: 3,
      forumPosts: 8,
      upcomingSessions: 2
    }));

    // Set mock upcoming sessions
    setUpcomingSessions([
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
  };


  const getProfileImageUrl = (imagePath) => {
    console.log("🔍 Processing image path:", imagePath);
    
    if (!imagePath) {
      console.log("❌ No image path provided, using default");
      return "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80";
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      console.log("✅ Already a full URL:", imagePath);
      return imagePath;
    }
    
    // Handle absolute Windows paths (like C:\Users\...)
    if (imagePath.startsWith('C:\\') || imagePath.includes(':\\')) {
      console.log("🪟 Windows absolute path detected");
      
      // Extract just the filename from the absolute path
      const filename = imagePath.split('\\').pop();
      console.log("📸 Extracted filename:", filename);
      
      const finalUrl = `http://localhost:3000/uploads/profile_images/${filename}`;
      console.log("✅ Converted to URL:", finalUrl);
      return finalUrl;
    }
    
    // If it's a local file path, convert to accessible URL
    let cleanPath = imagePath;
    
    // Remove any leading slashes or backslashes
    cleanPath = cleanPath.replace(/^[\\/]+/, '');
    
    // Handle Windows paths
    cleanPath = cleanPath.replace(/\\/g, '/');
    
    console.log("🔧 Cleaned path:", cleanPath);
    
    // If it starts with uploads, serve from static route
    if (cleanPath.startsWith('uploads/')) {
      const finalUrl = `http://localhost:3000/${cleanPath}`;
      console.log("✅ Serving from uploads:", finalUrl);
      return finalUrl;
    }
    
    // If it's just a filename, assume it's in profile_images
    if (!cleanPath.includes('/')) {
      const finalUrl = `http://localhost:3000/uploads/profile_images/${cleanPath}`;
      console.log("✅ Serving from profile_images:", finalUrl);
      return finalUrl;
    }
    
    console.log("❓ Unknown path format, using default");
    return "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80";
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !student) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Dashboard</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {student?.name?.split(' ')[0] || "Student"}!
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

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Profile & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <img
                src={getProfileImageUrl(student?.image)}
                alt={student?.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto mb-4"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80";
                }}
              />
              <h2 className="text-xl font-semibold text-gray-900">{student?.name || "Student Name"}</h2>
              <p className="text-gray-600 mb-1">{student?.course || "Not specified"} </p>
              <p className="text-sm text-gray-500 mb-4">{student?.university || "Not specified"}</p>
            </div>

            <div className="mt-6 space-y-3">
              {/* Bio */}
              {student?.bio && student.bio !== "Not specified" && (
                <div className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">About</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{student.bio}</p>
                </div>
              )}

              {/* Email */}
              <div className="flex items-center text-sm">
                <span className="w-6 text-gray-400">📧</span>
                <span className="text-gray-600">{student?.email || "No email provided"}</span>
              </div>

              {/* Address */}
              {student?.address && student.address !== "Not specified" && (
                <div className="flex items-center text-sm">
                  <span className="w-6 text-gray-400">📍</span>
                  <span className="text-gray-600">{student.address}</span>
                </div>
              )}

              {/* Join Date */}
              <div className="flex items-center text-sm">
                <span className="w-6 text-gray-400">📅</span>
                <span className="text-gray-600">Joined {student?.joinDate || "Unknown"}</span>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-500">Your latest interactions and contributions</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
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
              }
            ].map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

//-------Resources -------//
function ResourcesPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Initialize with API data
  useEffect(() => {
    fetchResources();
  }, []);

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/resources/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        const apiDocuments = response.data.data.map(resource => ({
          id: resource.resource_id,
          name: resource.file_name,
          type: getMimeType(resource.file_type),
          size: getFileSize(resource.file_path),
          uploadDate: resource.uploaded_at,
          uploader: resource.student ? 
            `${resource.student.name || ''} ${resource.student.surname || ''}`.trim() : 
            "Unknown User",
          downloads: 0,
          url: `http://localhost:3000/api/resources/download/${resource.resource_id}`,
          category: resource.session?.module_name || "General",
          description: resource.description || "No description",
          student_id: resource.student_id,
          isOwner: resource.student_id === user?.id
        }));
        
        setDocuments(apiDocuments);
        setFilteredDocuments(apiDocuments);
      }
    } catch (err) {
      console.error("Error fetching resources:", err);
      setDocuments([]);
      setFilteredDocuments([]);
    }
  };

  // Helper function to get MIME type from file extension
  const getMimeType = (fileType) => {
    const types = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ppt: "application/vnd.ms-powerpoint",
      csv: "text/csv"
    };
    return types[fileType?.toLowerCase()] || "application/octet-stream";
  };

  // Helper function to get file size
  const getFileSize = (filePath) => {
    return Math.floor(Math.random() * 5000000) + 100000;
  };

  // Search and filter functionality
  useEffect(() => {
    const filtered = documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredDocuments(filtered);
  }, [searchQuery, selectedCategory, documents]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    
    console.log("=== FRONTEND UPLOAD DEBUG ===");
    console.log("🔑 Token exists:", !!token);
    console.log("👤 User from localStorage:", user);
    console.log("📁 Files to upload:", files.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size
    })));

    try {
      setUploading(true);
      
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", `Uploaded by ${user?.name || 'User'}`);
      
      console.log("🚀 Sending POST request to /api/resources/upload...");
      
      const response = await axios.post("http://localhost:3000/api/resources/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        timeout: 30000,
      });

      console.log("✅ Upload successful! Response:", response.data);
      alert("File uploaded successfully!");
      
      await fetchResources();
      
    } catch (err) {
      console.error("❌ UPLOAD FAILED:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      let errorMessage = "Upload failed. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else if (err.code === 'TIMEOUT_ERROR') {
        errorMessage = "Request timeout. The server is taking too long to respond.";
      }
      
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      console.log("🗑️ Delete attempt - Detailed:", {
        resourceId: id,
        currentUserId: user?.id,
        currentUserName: user?.name,
        tokenExists: !!token
      });

      const response = await axios.delete(`http://localhost:3000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("✅ Delete successful:", response.data);
      
      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      setFilteredDocuments(prev => prev.filter(doc => doc.id !== id));
      alert("File deleted successfully");
      
    } catch (err) {
      console.error("❌ Delete failed - Full details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        user: JSON.parse(localStorage.getItem("user"))
      });
      
      const errorMessage = err.response?.data?.message || "Failed to delete file";
      const debugInfo = err.response?.data?.debug ? ` (Debug: ${JSON.stringify(err.response.data.debug)})` : '';
      
      alert(`Delete failed: ${errorMessage}${debugInfo}`);
    }
  };

  // Handle download
  const handleDownload = async (doc) => {
    try {
      const token = localStorage.getItem("token");
      console.log("📥 Download attempt:", {
        documentId: doc.id,
        documentName: doc.name,
        tokenExists: !!token
      });

      // Method 1: Direct download with authorization header
      const response = await axios.get(doc.url, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log("✅ Download successful");

    } catch (err) {
      console.error("❌ Download error:", err);
      
      // Method 2: Fallback - open in new tab with token
      if (err.response?.status === 403) {
        console.log("🔄 Trying fallback download method...");
        const downloadUrl = `${doc.url}?token=${token}`;
        window.open(downloadUrl, '_blank');
      } else {
        alert("Failed to download file");
      }
    }
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes('word')) return '';
    if (type.includes('pdf')) return '';
    if (type.includes('excel') || type.includes('spreadsheet')) return '';
    if (type.includes('powerpoint') || type.includes('presentation')) return '';
    if (type.includes('csv')) return '';
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
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get all unique categories
  const categories = ["all", ...new Set(documents.map(doc => doc.category))];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Study Resources</h1>
          <p className="text-gray-600 text-sm">Upload, share, and manage your study materials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-blue-300 transition-colors">
              <div className="mb-3">
                <FolderOpen className="mx-auto text-gray-400 text-3xl" />
              </div>
              <h3 className="font-semibold mb-2 text-base">Upload Documents</h3>
              <p className="text-xs text-gray-500 mb-3">
                Supported formats: PDF, Word, Excel, PowerPoint, CSV
              </p>
              
              <label className={`cursor-pointer inline-block px-4 py-2 rounded-lg transition-colors text-sm ${
                uploading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}>
                {uploading ? 'Uploading...' : 'Select Files'}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {uploading && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Uploading files...</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm">Quick Stats</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Files:</span>
                  <span className="font-medium">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Your Files:</span>
                  <span className="font-medium">
                    {documents.filter(doc => doc.isOwner).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Storage:</span>
                  <span className="font-medium">
                    {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Resource Library</h2>
                <p className="text-gray-600 text-sm">Browse and download study materials from your peers</p>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name, category, uploader, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                  />
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categories
                      </div>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-50 transition-colors ${
                            selectedCategory === category 
                              ? 'text-blue-600 bg-blue-50 font-medium' 
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
                <div className="flex flex-wrap gap-2 mb-3">
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">
                      Search: "{searchQuery}"
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:text-blue-600 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                      Category: {selectedCategory}
                      <button 
                        onClick={() => setSelectedCategory("all")}
                        className="ml-1 hover:text-green-600 font-bold text-xs"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results Count */}
              <div className="mb-4 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">
                  Showing {filteredDocuments.length} of {documents.length} resources
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </span>
              </div>

              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <FolderOpen className="mx-auto mb-3 opacity-50 text-3xl" />
                  <p className="text-gray-500 mb-1 text-sm">No resources found</p>
                  <p className="text-xs text-gray-400">
                    {searchQuery || selectedCategory !== 'all' 
                      ? "Try adjusting your search or filters" 
                      : "Be the first to upload a study resource!"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all bg-white"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{getFileIcon(doc.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">{doc.name}</h4>
                          {doc.description && doc.description !== "No description" && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{doc.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {doc.category}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {formatFileSize(doc.size)}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              By {doc.uploader}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {formatDate(doc.uploadDate)}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Download className="mr-1 w-3 h-3" />
                            {doc.downloads} downloads
                            {doc.isOwner && (
                              <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                Your file
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {doc.isOwner && (
                          <button
                            onClick={() => handleDeleteFile(doc.id)}
                            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Storage Info */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-blue-800 font-medium">Community Storage</span>
                  <span className="font-bold text-blue-900">
                    {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))} used
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((documents.reduce((sum, doc) => sum + doc.size, 0) / (100 * 1024 * 1024)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Sharing knowledge helps everyone learn better. Keep contributing! 📚
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//====== Forum Page ======//
function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit', 'comments'
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API Base URL
  const API_BASE_URL = 'http://localhost:3000/api/forum';

  // Main Flow 1: Create Post Form State
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    image: null,
    type: 'question',
    status: 'published'
  });

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // API Headers
  const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Enhanced fetch with better error handling
  const apiFetch = async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await apiFetch(`?${params.toString()}`);
      if (!response) return;
      
      const result = await response.json();
      if (result.success) {
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get current user and load posts on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchPosts();
  }, []);

  // Refetch posts when filters change
  useEffect(() => {
    fetchPosts();
  }, [filterStatus, filterType, searchTerm]);

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
  
  try {
    const method = selectedPost ? 'PUT' : 'POST';
    const url = selectedPost ? `/${selectedPost.id}` : '';
    
    // Don't send base64 image data to backend
    const postData = {
      title: postForm.title,
      content: postForm.content,
      type: postForm.type,
      status: postForm.status,
      // Don't include image field for now, or set it to null
      image: null
    };
    
    const response = await apiFetch(url, {
      method: method,
      body: JSON.stringify(postData)
    });

    if (!response) return;

    const result = await response.json();
    if (result.success) {
      await fetchPosts();
      
      setPostForm({
        title: '',
        content: '',
        image: null,
        type: 'question',
        status: 'published'
      });
      setSelectedPost(null);
      setViewMode('list');
      alert(`✅ Post ${selectedPost ? 'updated' : 'created'} successfully!`);
    } else {
      alert(`❌ Failed to ${selectedPost ? 'update' : 'create'} post: ${result.message}`);
    }
  } catch (error) {
    console.error('Error saving post:', error);
    alert(`❌ Failed to ${selectedPost ? 'update' : 'create'} post. Please try again.`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Edit post
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      image: post.image_url,
      type: post.type,
      status: post.status
    });
    setViewMode('edit');
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiFetch(`/${postId}`, {
        method: 'DELETE'
      });

      if (!response) return;

      const result = await response.json();
      if (result.success) {
        await fetchPosts();
        alert('✅ Post deleted successfully!');
      } else {
        alert(`❌ Failed to delete post: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('❌ Failed to delete post. Please try again.');
    }
  };

  // View comments
  const handleViewComments = (post) => {
    setSelectedPost(post);
    setViewMode('comments');
  };

  // Add comment
  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;
    
    try {
      const response = await apiFetch(`/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment })
      });

      if (!response) return;

      const result = await response.json();
      if (result.success) {
        await fetchPosts();
        setNewComment('');
        alert('✅ Comment added successfully!');
      } else {
        alert(`❌ Failed to add comment: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('❌ Failed to add comment. Please try again.');
    }
  };

  // Delete comment
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      // Note: You'll need to add a DELETE comment endpoint to your backend
      // For now, we'll just refetch the posts
      await fetchPosts();
      alert('✅ Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('❌ Failed to delete comment. Please try again.');
    }
  };

  // Like post
  const handleLikePost = async (postId) => {
    try {
      const response = await apiFetch(`/${postId}/like`, {
        method: 'POST'
      });

      if (!response) return;

      const result = await response.json();
      if (result.success) {
        await fetchPosts();
      } else {
        alert(`❌ Failed to like post: ${result.message}`);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('❌ Failed to like post. Please try again.');
    }
  };

  // Like comment
  const handleLikeComment = async (postId, commentId) => {
    // Note: You'll need to add a like comment endpoint to your backend
    // For now, we'll just show a message
    alert('Like comment functionality coming soon!');
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

  // Check if user can edit/delete post
  const canEditPost = (post) => {
    return currentUser && post.authorId === currentUser.id;
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Comments View
  if (viewMode === 'comments' && selectedPost) {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={14} />
            Back to Posts
          </button>

          {/* Post Summary */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">{selectedPost.title}</h3>
            <p className="text-gray-600 text-xs line-clamp-2">{selectedPost.content}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>{selectedPost.likes} likes</span>
              <span>{selectedPost.comments.length} comments</span>
            </div>
          </div>

          {/* Add Comment */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 mb-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Add a Comment</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
              <button
                onClick={() => handleAddComment(selectedPost.id)}
                disabled={!newComment.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Post
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Comments ({selectedPost.comments.length})
            </h3>
            
            {selectedPost.comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-3">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="text-lg">{comment.studentAvatar}</div>
                        <div>
                          <div className="text-xs font-medium text-gray-900">{comment.studentName}</div>
                          <div className="text-xs text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleLikeComment(selectedPost.id, comment.id)}
                          className="flex items-center gap-1 px-1 py-0.5 text-gray-600 hover:bg-gray-100 rounded text-xs"
                        >
                          <Heart size={12} />
                          {comment.likes}
                        </button>
                        {comment.studentId === currentUser?.id && (
                          <button
                            onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                            className="p-0.5 text-red-600 hover:bg-red-50 rounded text-xs"
                            title="Delete comment"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Create/Edit Post View
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedPost(null);
              setPostForm({
                title: '',
                content: '',
                image: null,
                type: 'question',
                status: 'published'
              });
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mb-3 text-sm"
          >
            <ArrowLeft size={14} />
            Back to Posts
          </button>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {viewMode === 'create' ? "Create New Post" : "Edit Post"}
          </h1>

          <form onSubmit={handleSavePost} className="space-y-4">
            {/* Post Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  value={postForm.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="question">Question</option>
                  <option value="study_group">Study Group</option>
                  <option value="resource">Resource Share</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={postForm.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter post title..."
                className="w-full border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs text-sm"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {postForm.title.length}/100
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={postForm.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Write your post content here..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-xs text-sm resize-none"
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {postForm.content.length}/1000
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Featured Image</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-xs"
                >
                  <ImagePlus size={12} />
                  {postForm.image ? 'Change Image' : 'Upload Image'}
                </label>
                {postForm.image && (
                  <div className="relative">
                    <img
                      src={postForm.image}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image', null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => {
                  setViewMode('list');
                  setSelectedPost(null);
                  setPostForm({
                    title: '',
                    content: '',
                    image: null,
                    type: 'question',
                    status: 'published'
                  });
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? 'Saving...' : (viewMode === 'create' ? 'Create Post' : 'Update Post')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main Posts List View
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Study Forum</h1>
            <p className="text-gray-600 text-sm">Discuss, share resources, and find study partners</p>
          </div>
          <button
            onClick={() => setViewMode('create')}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus size={14} />
            Create Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              <Search className="w-3 h-3" />
            </span>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-7 pr-2 py-1 outline-none placeholder:text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="question">Question</option>
              <option value="study_group">Study Group</option>
              <option value="resource">Resource</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-3 text-xs text-gray-600">
          Showing {posts.length} posts
        </div>

        {/* Empty State */}
        {posts.length === 0 && !loading ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <div className="text-base font-medium text-gray-900 mb-1">No posts yet</div>
            <p className="text-gray-600 text-sm mb-3">Create your first post to start the discussion</p>
            <button
              onClick={() => setViewMode('create')}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Create First Post
            </button>
          </div>
        ) : (
          /* Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Image */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                
                {/* Post Content */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      post.type === 'question' ? 'bg-blue-100 text-blue-800' :
                      post.type === 'study_group' ? 'bg-green-100 text-green-800' :
                      post.type === 'resource' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.type.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>by {post.author}</span>
                  </div>
                  
                  {/* Engagement Metrics */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-0.5 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Heart size={10} />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-0.5">
                        <MessageCircle size={10} />
                        {post.comments.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleViewComments(post)}
                      className="flex-1 flex items-center justify-center gap-0.5 px-1 py-0.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors text-xs"
                    >
                      <MessageCircle size={10} />
                      Comments
                    </button>
                    
                    {/* Only show Edit/Delete for post owner */}
                    {canEditPost(post) && (
                      <>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="flex-1 flex items-center justify-center gap-0.5 px-1 py-0.5 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors text-xs"
                        >
                          <Edit3 size={10} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex-1 flex items-center justify-center gap-0.5 px-1 py-0.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors text-xs"
                        >
                          <Trash2 size={10} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 text-xs mt-2">Loading posts...</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ---------- Settings Page ----------
function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [studentData, setStudentData] = useState(null);

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    university: "",
    course: "",
    yearOfStudy: "",
    address: "",
  });

  const [accountForm, setAccountForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch student data on component mount
  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/students/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setStudentData(data);
        
        // Split full name into first and last name
        const nameParts = data.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfileForm({
          firstName: firstName,
          lastName: lastName,
          bio: data.bio || "",
          university: data.university || "",
          course: data.course || "",
          yearOfStudy: data.year ? data.year.replace(' Year', '') : "",
          address: data.address || "",
        });

        setAccountForm(prev => ({
          ...prev,
          email: data.email || ""
        }));

        if (data.image && data.image !== "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80") {
          setPreview(data.image);
        }
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      // Set default data if API fails
      setProfileForm({
        firstName: "",
        lastName: "",
        bio: "",
        university: "",
        course: "",
        yearOfStudy: "",
        address: "",
      });
      setAccountForm(prev => ({
        ...prev,
        email: user?.email || ""
      }));
    }
  };

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
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Append profile data
      formData.append("name", profileForm.firstName);
      formData.append("surname", profileForm.lastName);
      formData.append("bio", profileForm.bio);
      formData.append("university", profileForm.university);
      formData.append("course", profileForm.course);
      formData.append("yos", profileForm.yearOfStudy);
      formData.append("address", profileForm.address);
      formData.append("email", accountForm.email);
      
      // Append profile image if changed
      if (previewFile) {
        formData.append("profile_image", previewFile);
      }

      const response = await axios.put("http://localhost:3000/api/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSaveStatus("saved");
        setErrors({});
        
        // Update local state with new data
        if (response.data.student) {
          const updatedStudent = response.data.student;
          setStudentData(prev => ({
            ...prev,
            ...updatedStudent
          }));
        }

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update profile",
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
      const token = localStorage.getItem("token");
      const updateData = {
        email: accountForm.email,
      };

      // Only include password fields if changing password
      if (accountForm.newPassword) {
        updateData.currentPassword = accountForm.currentPassword;
        updateData.newPassword = accountForm.newPassword;
      }

      const response = await axios.put("http://localhost:3000/api/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSaveStatus("saved");
        setErrors({});
        setAccountForm((prev) => ({ 
          ...prev, 
          currentPassword: "", 
          newPassword: "", 
          confirmPassword: "" 
        }));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Account settings updated successfully!",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error("Account update error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update account settings",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleResetForm = () => {
    // Reset to original student data
    if (studentData) {
      const nameParts = studentData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setProfileForm({
        firstName: firstName,
        lastName: lastName,
        bio: studentData.bio || "",
        university: studentData.university || "",
        course: studentData.course || "",
        yearOfStudy: studentData.year ? studentData.year.replace(' Year', '') : "",
        address: studentData.address || "",
      });
    }
    setPreview(studentData?.image || null);
    setPreviewFile(null);
    setErrors({});
  };

  const getSaveButtonText = () => {
    if (isLoading) return "Saving...";
    if (saveStatus === "saved") return "✓ Saved";
    return "Save Changes";
  };

  // Loading state
  if (!studentData && !profileForm.firstName) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 text-sm">Manage your profile and account preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6">
          {[
            { id: "profile", label: "Profile", icon: UserIcon },
            { id: "account", label: "Account", icon: LockIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
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
              <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl bg-white">
                <div className="relative">
                  <img
                    src={preview || studentData?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt="Profile"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow text-xs">
                    <CameraIcon className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {profileForm.firstName} {profileForm.lastName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">{profileForm.course || "Course"} Student</p>
                  <p className="text-xs text-gray-500">{profileForm.university || "University"}</p>
                  <div className="flex gap-2 mt-3">
                    <label className="cursor-pointer">
                      <span className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                        Upload New Photo
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <button
                      onClick={() => {
                        setPreview(null);
                        setPreviewFile(null);
                      }}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
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
                  <div className="bg-white p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <UserIcon className="w-4 h-4" /> Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          value={profileForm.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your first name"
                          style={{ color: profileForm.firstName ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          value={profileForm.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your last name"
                          style={{ color: profileForm.lastName ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          rows={2}
                          value={profileForm.bio}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm ${
                            errors.bio ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Tell us about yourself, your interests, and goals..."
                          style={{ color: profileForm.bio ? 'inherit' : '#9CA3AF' }}
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
                  <div className="bg-white p-6 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                      <GraduationCapIcon className="w-4 h-4" /> Study Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                        <input
                          value={profileForm.university}
                          onChange={(e) => handleProfileChange("university", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.university ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your university name"
                          style={{ color: profileForm.university ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                        <input
                          value={profileForm.course}
                          onChange={(e) => handleProfileChange("course", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.course ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your course/program"
                          style={{ color: profileForm.course ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                          <select
                            value={profileForm.yearOfStudy}
                            onChange={(e) => handleProfileChange("yearOfStudy", e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                          >
                            <option value="">Select year</option>
                            {[1, 2, 3, 4, 5, 6 , "Alumni"].map((year) => (
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                            placeholder="Enter your address"
                            style={{ color: profileForm.address ? 'inherit' : '#9CA3AF' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {getSaveButtonText()}
                </button>
                <button
                  onClick={handleResetForm}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* ---------- Account Tab ---------- */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="bg-white p-6 border border-gray-200 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                  <MailIcon className="w-4 h-4" /> Email & Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => handleAccountChange("email", e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                      style={{ color: accountForm.email ? 'inherit' : '#9CA3AF' }}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={accountForm.currentPassword}
                          onChange={(e) => handleAccountChange("currentPassword", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.currentPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                          style={{ color: accountForm.currentPassword ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={accountForm.newPassword}
                          onChange={(e) => handleAccountChange("newPassword", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.newPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter new password"
                          style={{ color: accountForm.newPassword ? 'inherit' : '#9CA3AF' }}
                        />
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={accountForm.confirmPassword}
                          onChange={(e) => handleAccountChange("confirmPassword", e.target.value)}
                          className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
                          style={{ color: accountForm.confirmPassword ? 'inherit' : '#9CA3AF' }}
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
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {getSaveButtonText()}
                  </button>
                  <button
                    onClick={() =>
                      setAccountForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
                    }
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors text-sm"
                  >
                    Clear Passwords
                  </button>
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

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Get current user from token
  const getCurrentUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.id,
          name: payload.name,
          role: payload.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    
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
    }
    
    return headers;
  };

  // Enhanced fetch with better error handling
  const apiFetch = async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: getHeaders()
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Fetch all groups
  const fetchAllGroups = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/all');
      if (!response) return;
      
      const result = await response.json();
      if (result.success) {
        setGroups(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my groups
  const fetchMyGroups = async () => {
    try {
      const response = await apiFetch('/my-groups');
      if (!response) return;
      
      const result = await response.json();
      if (result.success) {
        setMyGroups(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching my groups:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        await fetchAllGroups();
        await fetchMyGroups();
      } else {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle input changes properly
  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: value
    }));
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
      const response = await apiFetch('', {
        method: 'POST',
        body: JSON.stringify(newGroup)
      });

      if (!response) return;

      const result = await response.json();
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
      console.error('Error creating group:', error);
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
      const response = await apiFetch(`/${editGroup.id}`, {
        method: 'PUT',
        body: JSON.stringify(editGroup)
      });

      if (!response) return;

      const result = await response.json();
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
      console.error('Error updating group:', error);
      alert('❌ Failed to update study group. Please try again.');
    }
  };

  // Delete a group
  const handleDeleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Use the full API URL with your API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse JSON response
      const result = await response.json();
      
      if (result.success) {
        // Show success message
        alert('✅ Study group deleted successfully!');
        
        // Refresh the groups list
        await fetchAllGroups();
        await fetchMyGroups();
        
        // Close any open modals
        setShowDetailsModal(false);
        setShowEditModal(false);
      } else {
        throw new Error(result.message || 'Failed to delete group');
      }
      
    } catch (error) {
      console.error('Error deleting group:', error);
      alert(`❌ Error: ${error.message}`);
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
      console.error('Error joining group:', error);
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
      console.error('Error leaving group:', error);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Card Component for Study Groups
  const GroupCard = ({ group, showActions = true, isMyGroup = false }) => {
    const isMember = group.members?.includes(currentUser?.name);
    const isFull = (group.members?.length || 0) >= group.num_members;
    const availableSlots = group.num_members - (group.members?.length || 0);
    const isOwner = group.user_id === currentUser?.id;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.group_name}</h3>
            <p className="text-sm text-gray-600 mb-2">{group.module_name}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {group.meeting_platform}
          </span>
        </div>

        {/* Description */}
        {group.about && (
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{group.about}</p>
        )}

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium">{formatDate(group.meeting_date)} {group.meeting_time && `at ${group.meeting_time}`}</p>
          </div>
          <div>
            <span className="text-gray-500">Members:</span>
            <p className="font-medium">{group.members?.length || 0}/{group.num_members}</p>
          </div>
          <div>
            <span className="text-gray-500">Owner:</span>
            <p className="font-medium">{group.owner || "Unknown"}</p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <p className={`font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
              {isFull ? 'Full' : `${availableSlots} slots available`}
            </p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            {/* View Details button - always visible */}
            <button
              onClick={() => viewGroupDetails(group)}
              className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              View Details
            </button>
            
            {/* Show Edit/Delete only for group owner */}
            {isOwner ? (
              <>
                <button
                  onClick={() => {
                    setEditGroup({...group});
                    setShowEditModal(true);
                  }}
                  className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  Delete
                </button>
              </>
            ) : (
              // Show Join/Leave button for non-owners
              <button
                onClick={() => toggleJoin(group.id)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors border ${
                  isMember
                    ? 'text-red-600 hover:bg-red-50 border-red-200'
                    : 'text-green-600 hover:bg-green-50 border-green-200'
                }`}
                disabled={!isMember && isFull}
              >
                {isMember ? 'Leave Group' : isFull ? 'Full' : 'Join Group'}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
          <div className="p-5">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Card Component
  const Card = ({ children, title, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );

  if (!currentUser) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64 flex-col space-y-4">
        <div className="text-lg text-red-600">Please log in to view study groups</div>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
        >
          Go to Login
        </button>
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Study Circles</h1>
          <p className="text-gray-600">Find or manage your study groups</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Create Group
        </button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by group name, module, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.joinedOnly}
                    onChange={(e) => setFilters({...filters, joinedOnly: e.target.checked})}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Joined Groups Only
                </label>
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ownedOnly}
                    onChange={(e) => setFilters({...filters, ownedOnly: e.target.checked})}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  My Groups Only
                </label>
                <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.withSlots}
                    onChange={(e) => setFilters({...filters, withSlots: e.target.checked})}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  With Available Slots
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredGroups.length} of {groups.length} groups
        </div>
      </Card>

      {/* My Study Groups */}
      {myGroups.length > 0 && (
        <Card title="My Study Groups">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group} 
                showActions={true}
                isMyGroup={true}
              />
            ))}
          </div>
        </Card>
      )}

      {/* All Study Groups */}
      <Card title="All Study Groups">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-lg font-medium text-gray-900 mb-2">No groups found</div>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Create First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group} 
                showActions={true}
                isMyGroup={false}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => {setShowCreateModal(false); setErrors({});}} title="Create New Study Group">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              name="group_name"
              value={newGroup.group_name}
              onChange={handleInputChange(setNewGroup)}
              className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                errors.group_name ? 'border-red-500' : ''
              }`}
              placeholder="e.g., Advanced Calculus Study Group"
            />
            {errors.group_name && <p className="text-red-500 text-xs mt-1">{errors.group_name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module Name *
            </label>
            <input
              type="text"
              name="module_name"
              value={newGroup.module_name}
              onChange={handleInputChange(setNewGroup)}
              className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                errors.module_name ? 'border-red-500' : ''
              }`}
              placeholder="e.g., Calculus 101"
            />
            {errors.module_name && <p className="text-red-500 text-xs mt-1">{errors.module_name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="meeting_date"
                value={newGroup.meeting_date}
                onChange={handleInputChange(setNewGroup)}
                className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                  errors.meeting_date ? 'border-red-500' : ''
                }`}
              />
              {errors.meeting_date && <p className="text-red-500 text-xs mt-1">{errors.meeting_date}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                name="meeting_time"
                value={newGroup.meeting_time}
                onChange={handleInputChange(setNewGroup)}
                className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Members *
              </label>
              <input
                type="number"
                name="num_members"
                min="2"
                max="20"
                value={newGroup.num_members}
                onChange={handleInputChange(setNewGroup)}
                className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                  errors.num_members ? 'border-red-500' : ''
                }`}
              />
              {errors.num_members && <p className="text-red-500 text-xs mt-1">{errors.num_members}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Platform *
              </label>
              <select
                name="meeting_platform"
                value={newGroup.meeting_platform}
                onChange={handleInputChange(setNewGroup)}
                className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
              >
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Discord">Discord</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Link *
            </label>
            <input
              type="text"
              name="meeting_link"
              value={newGroup.meeting_link}
              onChange={handleInputChange(setNewGroup)}
              className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                errors.meeting_link ? 'border-red-500' : ''
              }`}
              placeholder="Paste your meeting link here"
            />
            {errors.meeting_link && <p className="text-red-500 text-xs mt-1">{errors.meeting_link}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About the Group
            </label>
            <textarea
              name="about"
              value={newGroup.about}
              onChange={handleInputChange(setNewGroup)}
              className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
              rows="3"
              placeholder="Describe the purpose and focus of this study group..."
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={() => {setShowCreateModal(false); setErrors({});}}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Create Group
          </button>
        </div>
      </Modal>

      {/* Edit Group Modal */}
      {showEditModal && editGroup && (
        <Modal isOpen={showEditModal} onClose={() => {setShowEditModal(false); setErrors({});}} title="Edit Study Group">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                name="group_name"
                value={editGroup.group_name}
                onChange={handleInputChange(setEditGroup)}
                className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                  errors.group_name ? 'border-red-500' : ''
                }`}
              />
              {errors.group_name && <p className="text-red-500 text-xs mt-1">{errors.group_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module Name *
              </label>
              <input
                type="text"
                name="module_name"
                value={editGroup.module_name}
                onChange={handleInputChange(setEditGroup)}
                className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                  errors.module_name ? 'border-red-500' : ''
                }`}
              />
              {errors.module_name && <p className="text-red-500 text-xs mt-1">{errors.module_name}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="meeting_date"
                  value={editGroup.meeting_date}
                  onChange={handleInputChange(setEditGroup)}
                  className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                    errors.meeting_date ? 'border-red-500' : ''
                  }`}
                />
                {errors.meeting_date && <p className="text-red-500 text-xs mt-1">{errors.meeting_date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="meeting_time"
                  value={editGroup.meeting_time}
                  onChange={handleInputChange(setEditGroup)}
                  className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Members *
                </label>
                <input
                  type="number"
                  name="num_members"
                  min="2"
                  max="20"
                  value={editGroup.num_members}
                  onChange={handleInputChange(setEditGroup)}
                  className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                    errors.num_members ? 'border-red-500' : ''
                  }`}
                />
                {errors.num_members && <p className="text-red-500 text-xs mt-1">{errors.num_members}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Platform *
                </label>
                <select
                  name="meeting_platform"
                  value={editGroup.meeting_platform}
                  onChange={handleInputChange(setEditGroup)}
                  className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
                >
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Discord">Discord</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link *
              </label>
              <input
                type="text"
                name="meeting_link"
                value={editGroup.meeting_link}
                onChange={handleInputChange(setEditGroup)}
                className={`w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm ${
                  errors.meeting_link ? 'border-red-500' : ''
                }`}
              />
              {errors.meeting_link && <p className="text-red-500 text-xs mt-1">{errors.meeting_link}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About the Group
              </label>
              <textarea
                name="about"
                value={editGroup.about}
                onChange={handleInputChange(setEditGroup)}
                className="w-full p-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none border border-gray-200 text-sm"
                rows="3"
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => {setShowEditModal(false); setErrors({});}}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleEditGroup}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Update Group
            </button>
          </div>
        </Modal>
      )}

      {/* Group Details Modal */}
      {showDetailsModal && selectedGroup && (
        <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Group Details">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 text-sm">Group Name:</span>
                <p className="font-medium">{selectedGroup.group_name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Module:</span>
                <p className="font-medium">{selectedGroup.module_name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Date:</span>
                <p className="font-medium">{formatDate(selectedGroup.meeting_date)} {selectedGroup.meeting_time && `at ${selectedGroup.meeting_time}`}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Platform:</span>
                <p className="font-medium">{selectedGroup.meeting_platform}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Members:</span>
                <p className="font-medium">{selectedGroup.members?.length || 0}/{selectedGroup.num_members}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Owner:</span>
                <p className="font-medium">{selectedGroup.owner || "Unknown"}</p>
              </div>
            </div>
            
            {selectedGroup.about && (
              <div>
                <span className="text-gray-500 text-sm">Description:</span>
                <p className="font-medium text-sm mt-1">{selectedGroup.about}</p>
              </div>
            )}
            
            <div>
              <span className="text-gray-500 text-sm">Meeting Link:</span>
              <a 
                href={selectedGroup.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 text-sm block mt-1 break-all"
              >
                {selectedGroup.meeting_link}
              </a>
            </div>
            
            {selectedGroup.members && selectedGroup.members.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm">Current Members:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGroup.members.map((member, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 text-sm"
            >
              Close
            </button>
            
            {/* Show Edit/Delete only for group owner */}
            {selectedGroup.user_id === currentUser.id ? (
              <>
                <button
                  onClick={() => {
                    setEditGroup({...selectedGroup});
                    setShowEditModal(true);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGroup(selectedGroup.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 text-sm"
                >
                  Delete
                </button>
              </>
            ) : (
              // Show Join/Leave button for non-owners
              <button
                onClick={() => {
                  toggleJoin(selectedGroup.id);
                  setShowDetailsModal(false);
                }}
                className={`px-4 py-2 rounded-lg transition-colors border text-sm ${
                  selectedGroup.members?.includes(currentUser.name)
                    ? 'text-red-600 hover:bg-red-50 border-red-200'
                    : 'text-green-600 hover:bg-green-50 border-green-200'
                }`}
              >
                {selectedGroup.members?.includes(currentUser.name) ? 'Leave Group' : 'Join Group'}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ----------- Main App -----------
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Add this hook

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage />;
      case "study-circle":
        return <StudyCirclePage />;
      case "resources":
        return <ResourcesPage />;
      case "scheduler":
        return <TaskScheduler />;
      case "forum":
        return <ForumPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove token from sessionStorage (if used)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear any other user-related data
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
    
    // Optional: Clear all localStorage (be careful with this)
    // localStorage.clear();
    
    console.log('User logged out successfully');
    
    // Redirect to homepage
    navigate('/'); // or window.location.href = '/';
    
    // If you're not using React Router, you can use:
    // window.location.href = '/';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        page={page} 
        setPage={setPage} 
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      <main className={`
        flex-1 min-h-screen transition-all duration-300 overflow-auto bg-white
        ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="p-4 lg:p-6 bg-white">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
