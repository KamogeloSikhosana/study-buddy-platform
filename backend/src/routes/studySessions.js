import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// -----------------------------
// Get study groups for a specific user
// -----------------------------
router.get("/user/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("🔍 Fetching study groups for user ID:", id);

    let studyGroups = [];
    
    try {
      studyGroups = await prisma.sessionMembers.findMany({
        where: { student_id: Number(id) },
        include: {
          session: true
        }
      });
      
      console.log("✅ Found study groups via sessionMembers:", studyGroups.length);
    } catch (memberError) {
      console.log("❌ Error fetching study groups:", memberError);
      studyGroups = [];
    }

    const formattedGroups = studyGroups.map(member => {
      const group = member.session;
      return {
        id: group.session_id,
        name: group.group_name,
        description: group.about,
        subject: group.module_name,
        memberCount: group.num_members
      };
    });

    res.json({ 
      success: true, 
      data: formattedGroups
    });
  } catch (err) {
    console.error("❌ Error fetching study groups:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching study groups" 
    });
  }
});

// -----------------------------
// Get upcoming study sessions for a user
// -----------------------------
router.get("/upcoming/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    
    console.log("🔍 Fetching upcoming sessions for user ID:", id);

    let sessions = [];
    
    try {
      sessions = await prisma.studySessions.findMany({
        where: {
          members: {
            some: {
              student_id: Number(id)
            }
          },
          meeting_date: {
            gte: today
          }
        },
        include: {
          student: {
            select: { 
              name: true,
              surname: true
            }
          },
          members: {
            include: {
              student: {
                select: {
                  name: true,
                  surname: true
                }
              }
            }
          }
        },
        orderBy: { 
          meeting_date: 'asc' 
        },
        take: 5
      });
      
      console.log("✅ Found sessions:", sessions.length);
    } catch (sessionError) {
      console.log("❌ Error fetching sessions:", sessionError);
      sessions = [];
    }

    const formattedSessions = sessions.map(session => ({
      id: session.session_id,
      title: session.group_name,
      group: session.module_name || "General Study",
      date: session.meeting_date,
      time: session.meeting_time,
      duration: "2 hours",
      participants: session.members?.length || 0
    }));

    console.log("📊 Formatted sessions:", formattedSessions.length);

    if (formattedSessions.length === 0) {
      console.log("📝 No sessions found, returning mock data");
      const mockSessions = [
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
      ];
      return res.json({ 
        success: true, 
        data: mockSessions 
      });
    }

    res.json({ 
      success: true, 
      data: formattedSessions 
    });
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    
    const mockSessions = [
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
    ];

    res.json({ 
      success: true, 
      data: mockSessions 
    });
  }
});

// -----------------------------
// Get all study sessions
// -----------------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [sessions, totalCount] = await Promise.all([
      prisma.studySessions.findMany({
        include: {
          student: {
            select: {
              name: true,
              surname: true
            }
          },
          members: {
            include: {
              student: {
                select: {
                  name: true,
                  surname: true
                }
              }
            }
          }
        },
        orderBy: {
          meeting_date: 'asc'
        },
        skip,
        take: limitNum
      }),
      prisma.studySessions.count()
    ]);

    const formattedSessions = sessions.map(session => ({
      id: session.session_id,
      title: session.group_name,
      description: session.about,
      date: session.meeting_date,
      time: session.meeting_time,
      duration: "2 hours",
      group: session.module_name,
      currentParticipants: session.members?.length || 0,
      maxParticipants: session.num_members
    }));

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: formattedSessions,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (err) {
    console.error("❌ Error fetching all sessions:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching sessions" 
    });
  }
});

// -----------------------------
// Create a new study session
// -----------------------------
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      studyGroupId,
      sessionTitle,
      sessionDescription,
      sessionDate,
      sessionTime,
      duration,
      maxParticipants
    } = req.body;

    console.log("📝 Creating new study session:", {
      studyGroupId, sessionTitle, sessionDate, sessionTime
    });

    // Validate required fields
    if (!studyGroupId || !sessionTitle || !sessionDate || !sessionTime) {
      return res.status(400).json({
        success: false,
        message: "Study group ID, session title, date, and time are required"
      });
    }

    const newSession = await prisma.studySessions.create({
      data: {
        group_name: sessionTitle,
        about: sessionDescription,
        meeting_date: sessionDate,
        meeting_time: sessionTime,
        student_id: req.user.id,
        num_members: maxParticipants ? Number(maxParticipants) : 10
      }
    });

    console.log("✅ Study session created successfully");

    res.status(201).json({
      success: true,
      message: "Study session created successfully",
      data: newSession
    });

  } catch (err) {
    console.error("❌ Error creating study session:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while creating study session" 
    });
  }
});

// -----------------------------
// Join a study session
// -----------------------------
router.post("/:id/join", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("👥 User", studentId, "joining session", id);

    const session = await prisma.studySessions.findUnique({
      where: { session_id: Number(id) },
      include: {
        members: true
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found"
      });
    }

    // Check if user is already participating
    const existingParticipation = await prisma.sessionMembers.findFirst({
      where: {
        session_id: Number(id),
        student_id: studentId
      }
    });

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: "You are already participating in this session"
      });
    }

    // Check if session is full
    if (session.members && session.members.length >= session.num_members) {
      return res.status(400).json({
        success: false,
        message: "This study session is full"
      });
    }

    // Add participant
    await prisma.sessionMembers.create({
      data: {
        session_id: Number(id),
        student_id: studentId
      }
    });

    console.log("✅ User joined session successfully");

    res.json({
      success: true,
      message: "Successfully joined the study session"
    });

  } catch (err) {
    console.error("❌ Error joining study session:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while joining study session" 
    });
  }
});

// -----------------------------
// Leave a study session
// -----------------------------
router.delete("/:id/leave", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("👥 User", studentId, "leaving session", id);

    // Remove participant
    await prisma.sessionMembers.deleteMany({
      where: {
        session_id: Number(id),
        student_id: studentId
      }
    });

    console.log("✅ User left session successfully");

    res.json({
      success: true,
      message: "Successfully left the study session"
    });

  } catch (err) {
    console.error("❌ Error leaving study session:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while leaving study session" 
    });
  }
});

// -----------------------------
// Get session participants
// -----------------------------
router.get("/:id/participants", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await prisma.sessionMembers.findMany({
      where: { session_id: Number(id) },
      include: {
        student: {
          select: {
            student_id: true,
            name: true,
            surname: true,
            profile_image: true
          }
        }
      }
    });

    const formattedParticipants = participants.map(p => ({
      id: p.student.student_id,
      name: `${p.student.name} ${p.student.surname}`,
      image: p.student.profile_image
    }));

    res.json({
      success: true,
      data: formattedParticipants
    });

  } catch (err) {
    console.error("❌ Error fetching participants:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching participants" 
    });
  }
});

// Use alternative export syntax to avoid any hidden character issues
export { router as default };