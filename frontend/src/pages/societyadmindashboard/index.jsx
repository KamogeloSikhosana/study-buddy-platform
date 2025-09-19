import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
//=====MOCK IMAGES FOR MEMBERS ======//
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";
import photo3 from "@/assets/photo3.jpg";
import aws from "@/assets/aws.jpeg";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  ShieldCheck,
  Settings,
  Plus,
  Check,
  X,
  Search,
  Heart,
  MessageCircle,
  ChevronRight,
  Menu,
  BarChart3,
  Trash2,
  Edit3,
  ImagePlus,
} from "lucide-react";


// Brand palette (aligns with student dashboard)
const colors = {
  paper: "#e7e7e7",
  mist: "#d2d3de",
  lilac: "#ac98cd",
  plum: "#6a509b",
};

// Reusable UI
function Card({ title, subtitle, action, children }) {
  return (
    <div
      className="rounded-3xl p-4 md:p-5 shadow-sm"
      style={{ background: "white", border: `1px solid ${colors.mist}` }}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            {title && (
              <h3 className="font-semibold text-lg" style={{ color: colors.plum }}>
                {title}
              </h3>
            )}
            {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="text-xs rounded-xl px-2 py-1" style={{ background: colors.mist }}>
      {children}
    </span>
  );
}

// Mock data
const mockStats = { members: 248, pending: 7, events: 3, posts: 12 };

const mockMembers = [
  { id: 1, name: "Ayesha Khan", role: "President", email: "ayesha@email.com", phone: "(229) 555-0109", joinDate: "7/27/21", image: photo1 },
  { id: 2, name: "Liam Smith", role: "Treasurer", email: "liam@email.com", phone: "(404) 555-0120", joinDate: "10/28/20", image: photo2 },
  { id: 3, name: "Zinhle Mokoena", role: "Member", email: "zinhle@email.com", phone: "(684) 555-0102", joinDate: "9/14/22", image: photo3 },
  { id: 4, name: "Carlos Diaz", role: "Member", email: "carlos@email.com", phone: "(229) 555-0111", joinDate: "1/15/23", image: photo1 },
];

const mockRequests = [
  { id: 31, name: "Naledi M.", note: "Interested in robotics projects" },
  { id: 32, name: "Peter J.", note: "Attended the demo night" },
  { id: 33, name: "Anita R.", note: "Works with Arduino" },
];

const mockEvents = [
  { id: 101, title: "Intro to ML Workshop", date: "Sep 12, 2025", time: "16:00", location: "Lab A", rsvp: 52 },
  { id: 102, title: "Robotics Build Night", date: "Sep 19, 2025", time: "18:30", location: "Makerspace", rsvp: 34 },
  { id: 103, title: "AI Ethics Roundtable", date: "Sep 28, 2025", time: "15:00", location: "Room 2.14", rsvp: 21 },
];

const mockPosts = [
  {
    id: 201,
    title: "Upcoming AI Event 🚀",
    description: "Join us for an exciting AI & Robotics event hosted by Tech Innovators Society. Expect demos, guest speakers, and networking!",
    image: photo1,
    status: "Published",
    date: "2025-09-01 14:30",
    likes: 12,
    comments: [
      { id: 1, name: "Ayesha", text: "This looks amazing!" },
      { id: 2, name: "Carlos", text: "Count me in 👏" },
    ],
  },
  {
    id: 202,
    title: "AWS Summit Johannesburg",
    description: "Our society had an amazing time attending the AWS Summit in Johannesburg. Learned so much about cloud & AI!",
    image: aws,
    status: "Published",
    date: "2025-08-25 10:00",
    likes: 8,
    comments: [
      { id: 1, name: "Zinhle", text: "Wish I could’ve joined!" },
    ],
  },
  {
    id: 203,
    title: "AI and Jobs 🤖",
    description: "Do you think AI will take over most tech jobs in the next decade? Share your thoughts below!",
    image: null,
    status: "Draft",
    date: "2025-08-15 18:45",
    likes: 3,
    comments: [],
  },
];

const mockActivity = [
  { id: 401, text: "Approved join request from Naledi", time: "2h ago" },
  { id: 402, text: "Published: Photos from last build!", time: "Yesterday" },
  { id: 403, text: "Updated event: Robotics Build Night", time: "2 days ago" },
];

const mockParticipation = [
  { label: "Event attendance", value: 72 },
  { label: "Weekly post rate", value: 65 },
  { label: "Member retention", value: 88 },
  { label: "Comment activity", value: 54 },
];

// Layout shell (light, like student dashboard)
function Shell({ page, setPage, children }) {
  const [open, setOpen] = useState(true);
  const nav = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { key: "members", label: "Members", icon: <Users size={18} /> },
    { key: "events", label: "Events", icon: <CalendarDays size={18} /> },
    { key: "posts", label: "Posts", icon: <FileText size={18} /> },
    { key: "requests", label: "Requests", icon: <ShieldCheck size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
    { key: "metrics", label: "Metrics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: `linear-gradient(to bottom, ${colors.plum} 0%, white 100%)` }}
    >
      

      <div className="mx-auto max-w-7xl py-6 grid grid-cols-12 gap-6 px-4 md:px-6 lg:px-8">

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div
            className="flex flex-col h-full p-4 rounded-r-3xl"
            style={{
              background: "white",
              borderRight: `1px solid ${colors.mist}`,
            }}
          >
            {/* Logo / Header */}
            <div className="mb-8 px-2 flex items-center">
              <img 
                src="/src/assets/logo.png" 
                alt="meetmind.ai logo" 
                className="h-35 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
              {nav.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left transition ${
                    page === item.key
                      ? "bg-lilac text-gray-700 shadow-sm"
                      : "text-gray-700 hover:bg-mist"
                  }`}
                >
                  {/* Icon wrapper changes color with active state */}
                  <div
                    className={`flex-shrink-0 ${
                      page === item.key ? "text-gray-600" : "text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Footer Section */}
            <div>
              <div
                className="mb-4 p-3 rounded-2xl"
                style={{ background: colors.mist }}
              >
                <div className="text-xs opacity-70 mb-1">Managing</div>
                <div className="text-sm font-semibold">AI & Robotics Society</div>
                <div className="text-xs opacity-70">Role: Admin</div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => console.log("Logging out...")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left transition text-gray-700 hover:bg-red-100 hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H3m12-6l6 6-6 6"
                  />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>



        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// Pages
function OverviewPage() {
  return (
    <>
      <Card title="Overview" subtitle="Quick stats for your society.">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-2xl p-4" style={{ background: colors.lilac }}>
            <div className="text-white/90 text-sm">Members</div>
            <div className="text-3xl font-bold text-white">{mockStats.members}</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: colors.plum }}>
            <div className="text-white/90 text-sm">Pending Requests</div>
            <div className="text-3xl font-bold text-white">{mockStats.pending}</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: colors.mist }}>
            <div className="text-sm">Upcoming Events</div>
            <div className="text-3xl font-bold">{mockStats.events}</div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: colors.paper }}>
            <div className="text-sm">Posts</div>
            <div className="text-3xl font-bold">{mockStats.posts}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Upcoming events"
          subtitle="Manage RSVPs and details"
          action={
            <button className="text-sm rounded-xl px-3 py-1 text-white hover:opacity-90 transition-opacity" style={{ background: colors.plum }}>
              <Plus size={16} className="inline mr-1" /> New event
            </button>
          }
        >
          <div className="space-y-3">
            {mockEvents.map((e) => (
              <div key={e.id} className="p-3 rounded-2xl flex items-center justify-between gap-3" style={{ background: colors.paper }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-xl px-3 py-2 text-sm font-semibold text-white flex-shrink-0" style={{ background: colors.lilac }}>
                    {e.date}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{e.title}</div>
                    <div className="text-xs opacity-70">{e.time} • {e.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Pill>{e.rsvp} going</Pill>
                  <button className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors" style={{ background: colors.mist }}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent posts" subtitle="Drafts, scheduled, and published">
          <div className="space-y-3">
            {mockPosts.map((p) => (
              <div key={p.id} className="p-3 rounded-2xl flex items-center justify-between gap-3" style={{ background: colors.paper }}>
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs opacity-70">Status: {p.status}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors flex items-center gap-1" style={{ background: colors.mist }}><Edit3 size={14} /> Edit</button>
                  <button className="rounded-xl px-3 py-1 text-sm text-white hover:opacity-90 transition-opacity" style={{ background: colors.plum }}>Publish</button>
                  <button className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors flex items-center gap-1" style={{ background: colors.mist }}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent activity" subtitle="Latest actions across your society">
        <ul className="space-y-2">
          {mockActivity.map((a) => (
            <li key={a.id} className="p-3 rounded-2xl flex items-center justify-between" style={{ background: colors.paper }}>
              <span className="text-sm">{a.text}</span>
              <span className="text-xs opacity-60">{a.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function MembersPage() {
  const [search, setSearch] = useState("");

  const filteredMembers = mockMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card
      title="Members"
      subtitle="Manage roles and remove inactive members"
      action={
        <button
          className="text-sm rounded-xl px-3 py-1 text-white hover:opacity-90 transition-opacity"
          style={{ background: colors.plum }}
        >
          Invite
        </button>
      }
    >
      {/* Search Bar */}
      <div className="mb-4 relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <Search className="w-4 h-4" />
      </span>
      <input
        type="text"
        placeholder="Search members..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 outline-none placeholder:text-sm focus:ring-1 focus:ring-lilac"
      />
    </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMembers.map((m) => (
          <div
            key={m.id}
            className="p-4 rounded-2xl shadow-md"
            style={{ background: colors.paper }}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <img
                src={m.image}
                alt={m.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-base">{m.name}</div>
                <div className="text-sm opacity-70">{m.role}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-3 text-sm space-y-1 opacity-80">
              <div><strong>Email:</strong> {m.email}</div>
              <div><strong>Phone:</strong> {m.phone}</div>
              <div><strong>Join Date:</strong> {m.joinDate}</div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors"
                style={{ background: colors.mist }}
              >
                Promote
              </button>
              <button
                className="p-2 rounded-xl hover:bg-mist/80 transition-colors"
                style={{ background: colors.mist }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}



function EventsPage() {
  const [activeTab, setActiveTab] = useState("My Events");

  return (
    <Card title="Events" subtitle="Manage your society events">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === "My Events"
              ? "border-b-2 border-plum text-plum"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("My Events")}
        >
          My Events
        </button>
        <button
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === "Create Event"
              ? "border-b-2 border-plum text-plum"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Create Event")}
        >
          Create Event
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "My Events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockEvents.map((e) => (
            <div
              key={e.id}
              className="rounded-3xl p-4 space-y-2"
              style={{ background: "white", border: `1px solid ${colors.mist}` }}
            >
              <div
                className="rounded-xl px-3 py-1 inline-block text-xs text-white"
                style={{ background: colors.lilac }}
              >
                {e.date}
              </div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-xs opacity-70">
                {e.time} • {e.location}
              </div>
              <div className="flex items-center justify-between gap-2">
                <Pill>{e.rsvp} going</Pill>
                <div className="flex gap-2">
                  <button
                    className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors flex items-center gap-1"
                    style={{ background: colors.mist }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors flex items-center gap-1"
                    style={{ background: colors.mist }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Create Event" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Form */}
          <div>
            {/* Event Poster Upload */}
            <div className="text-xs mb-1 opacity-70">Event Poster</div>
            <div
            
              className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-10 mb-6 cursor-pointer hover:bg-mist/50 transition"
              style={{ borderColor: colors.mist }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <button
                className="px-4 py-2 rounded-xl text-white text-sm hover:opacity-90 transition"
                style={{ background: colors.plum }}
              >
                Browse File
              </button>
            </div>

            {/* Event Details Form */}
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <div className="text-xs mb-1 opacity-70">Event Name</div>
                <input
                  className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                            focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                  style={{ background: "white" }}
                  placeholder="AI & Robotics Workshop"
                />
              </label>

              <label className="block">
                <div className="text-xs mb-1 opacity-70">Description</div>
                <textarea
                  rows={4}
                  className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                            focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                  style={{ background: "white" }}
                  placeholder="Briefly describe your event..."
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-xs mb-1 opacity-70">Date</div>
                  <input
                    type="date"
                    className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                              focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                    style={{ background: "white" }}
                  />
                </label>

                <label className="block">
                  <div className="text-xs mb-1 opacity-70">Time</div>
                  <input
                    type="time"
                    className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                              focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                    style={{ background: "white" }}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-2xl px-4 py-2 text-white hover:opacity-90 transition-opacity"
                  style={{ background: colors.plum }}
                >
                  Submit Event
                </button>
                <button
                  className="rounded-2xl px-4 py-2 hover:bg-mist/80 transition-colors"
                  style={{ background: colors.mist }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Pending Message */}
          <div className="text-sm text-gray-700 space-y-2">
            <ul className="list-disc pl-5">
              <li>
                Once you submit your event, it will be pending review from the system administrator. Once your event has been approved you will receive a message updating you about this.
              </li>
            </ul>
          </div>
        </div>
      )}

    </Card>
  );
}


function PostsPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [openComments, setOpenComments] = useState(null);

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked }
          : p
      )
    );
  };

  const toggleComments = (id) => {
    setOpenComments(openComments === id ? null : id);
  };

  return (
    <Card
      title="Posts"
      subtitle="Draft announcements and updates"
      action={
        <button
          className="text-sm rounded-xl px-3 py-1 text-white hover:opacity-90 transition-opacity"
          style={{ background: colors.plum }}
        >
          + New Post
        </button>
      }
    >
      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl"
            style={{ background: colors.paper }}
          >
            {/* Post Image */}
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-full rounded-xl mb-3 object-cover max-h-64"
              />
            )}

            {/* Post Content */}
            <div className="mb-2">
              <div className="font-medium text-lg">{p.title}</div>
              <div className="text-sm opacity-70">{p.description}</div>
              <div className="text-xs text-gray-500 mt-1">{p.date}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-2">
              {/* Like */}
              <button
                onClick={() => toggleLike(p.id)}
                className="flex items-center gap-1 text-sm"
              >
                <Heart
                  size={18}
                  className={p.liked ? "text-red-500 fill-red-500" : "text-gray-500"}
                />
                {p.likes}
              </button>

              {/* Comments */}
              <button
                onClick={() => toggleComments(p.id)}
                className="flex items-center gap-1 text-sm"
              >
                <MessageCircle size={18} className="text-gray-500" />
                {p.comments.length}
              </button>
            </div>

            {/* Comments Section */}
            {openComments === p.id && (
              <div className="mt-3 space-y-2">
                {p.comments.length === 0 && (
                  <div className="text-xs text-gray-500">No comments yet.</div>
                )}
                {p.comments.map((c) => (
                  <div
                    key={c.id}
                    className="text-sm bg-gray-100 p-2 rounded-lg"
                  >
                    <span className="font-medium">{c.name}: </span>
                    {c.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function RequestsPage() {
  return (
    <Card title="Join requests" subtitle="Approve or decline membership requests">
      <div className="space-y-3">
        {mockRequests.map((r) => (
          <div key={r.id} className="p-3 rounded-2xl flex items-center justify-between gap-3" style={{ background: colors.paper }}>
            <div className="min-w-0">
              <div className="font-medium truncate">{r.name}</div>
              <div className="text-xs opacity-70 truncate">{r.note}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="rounded-xl px-3 py-1 text-sm text-white hover:opacity-90 transition-opacity" style={{ background: colors.plum }}>
                <Check size={16} className="inline mr-1" /> Approve
              </button>
              <button className="rounded-xl px-3 py-1 text-sm hover:bg-mist/80 transition-colors" style={{ background: colors.mist }}>
                <X size={16} className="inline mr-1" /> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <Card title="Settings" subtitle="Update society profile, security and preferences">
      {/* Tabs Header */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            className={`px-4 py-2 -mb-px font-medium ${
              activeTab === "Profile"
                ? "border-b-2 border-plum text-plum"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 -mb-px font-medium ${
              activeTab === "Security"
                ? "border-b-2 border-plum text-plum"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Security")}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "Profile" && (
          <div>
            {/* Upload Box */}
            
            <div
              className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-10 mb-6 cursor-pointer hover:bg-mist/50 transition"
              style={{ borderColor: colors.mist }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              <button
                className="px-4 py-2 rounded-xl text-white text-sm hover:opacity-90 transition"
                style={{ background: colors.plum }}
              >
                Browse File
              </button>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-xs mb-1 opacity-70">Society name</div>
                <input
                  className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                            focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                  style={{ background: "white" }}
                  placeholder="AI & Robotics Society"
                />
              </label>
              <label className="block">
                <div className="text-xs mb-1 opacity-70">Category</div>
                <input
                  className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                            focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                  style={{ background: "white" }}
                  placeholder="Technology"
                />
              </label>
              <label className="block md:col-span-2">
                <div className="text-xs mb-1 opacity-70">About Society</div>
                <textarea
                  rows={4}
                  className="w-full border border-gray-400 rounded-[7px] px-3 py-2 outline-none placeholder:text-sm
                            focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                  style={{ background: "white" }}
                  placeholder="We host weekly workshops on ML, robotics, and hack nights."
                />
              </label>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                className="rounded-2xl px-4 py-2 text-white hover:opacity-90 transition-opacity"
                style={{ background: colors.plum }}
              >
                Save changes
              </button>
              <button
                className="rounded-2xl px-4 py-2 hover:bg-mist/80 transition-colors"
                style={{ background: colors.mist }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {activeTab === "Security" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Admin Name */}
          <div className="relative">
            <label className="block text-xs mb-1 opacity-70">Admin Name</label>
            <input
              type="text"
              className="w-full rounded-[7px] border border-gray-400 px-3 py-2 outline-none placeholder:text-sm
                        focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
              placeholder="Enter admin name"
              style={{ background: "white" }}
            />
          </div>

          {/* Admin Surname */}
          <div className="relative">
            <label className="block text-xs mb-1 opacity-70">Admin Surname</label>
            <input
              type="text"
              className="w-full rounded-[7px] border border-gray-400 px-3 py-2 outline-none placeholder:text-sm
                        focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
              placeholder="Enter admin surname"
              style={{ background: "white" }}
            />
          </div>

          {/* Email */}
          <div className="relative md:col-span-2">
            <label className="block text-xs mb-1 opacity-70">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                </svg>
              </span>
              <input
                type="email"
                className="w-full pl-9 rounded-[7px] border border-gray-400 px-3 py-2 outline-none placeholder:text-sm
                          focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                placeholder="your@email.com"
                style={{ background: "white" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-xs mb-1 opacity-70">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
              </span>
              <input
                type="password"
                className="w-full pl-9 rounded-[7px] border border-gray-400 px-3 py-2 outline-none placeholder:text-sm
                          focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                placeholder="Enter new password"
                style={{ background: "white" }}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-xs mb-1 opacity-70">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
              </span>
              <input
                type="password"
                className="w-full pl-9 rounded-[7px] border border-gray-400 px-3 py-2 outline-none placeholder:text-sm
                          focus:border-[1px] focus:border-gray-400 focus:ring-1 focus:ring-lilac"
                placeholder="Confirm new password"
                style={{ background: "white" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 md:col-span-2">
            <button
              className="rounded-2xl px-4 py-2 text-white hover:opacity-90 transition-opacity"
              style={{ background: colors.plum }}
            >
              Update Security
            </button>
            <button
              className="rounded-2xl px-4 py-2 hover:bg-mist/80 transition-colors"
              style={{ background: colors.mist }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </Card>
  );
}



function MetricsPage() {
  return (
    <Card title="Participation Metrics" subtitle="Engagement across members and content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {mockParticipation.map((m) => (
            <div key={m.label} className="p-3 rounded-2xl" style={{ background: colors.paper }}>
              <div className="text-sm mb-2">{m.label} <span className="opacity-60">— {m.value}%</span></div>
              <div className="h-2 rounded-full" style={{ background: colors.mist }}>
                <div className="h-2 rounded-full" style={{ width: `${m.value}%`, background: colors.plum }} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-2xl" style={{ background: colors.paper }}>
          <div className="font-medium mb-2">Top active members</div>
          <ul className="text-sm space-y-2">
            <li>• Ayesha — 12 comments, 3 posts</li>
            <li>• Liam — 9 comments, 1 post</li>
            <li>• Zinhle — 7 comments, 2 posts</li>
            <li>• Carlos — 5 comments, 1 post</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

// App wrapper
export default function SocietyAdminDashboard() {
  const [page, setPage] = useState("overview");
  return (
    <Shell page={page} setPage={setPage}>
      {page === "overview" && <OverviewPage />}
      {page === "members" && <MembersPage />}
      {page === "events" && <EventsPage />}
      {page === "posts" && <PostsPage />}
      {page === "requests" && <RequestsPage />}
      {page === "settings" && <SettingsPage />}
      {page === "metrics" && <MetricsPage />}
    </Shell>
  );
}

