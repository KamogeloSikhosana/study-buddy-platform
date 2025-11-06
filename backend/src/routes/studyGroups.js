import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// -----------------------------
// Get all study groups
// -----------------------------
router.get("/all", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Fetching all study groups from StudySessions");

    const groups = await prisma.studySessions.findMany({
      include: {
        members: {
          include: {
            student: {
              select: {
                name: true,
                surname: true
              }
            }
          }
        },
        student: {
          select: {
            name: true,
            surname: true,
            student_id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log("✅ Found study sessions:", groups.length);

    const formattedGroups = groups.map(group => {
      const members = group.members || [];
      
      return {
        id: group.session_id,
        group_name: group.group_name,
        module_name: group.module_name || "General",
        about: group.about || "No description",
        num_members: group.num_members || 8,
        meeting_link: group.meeting_link || "",
        meeting_platform: group.meeting_platform || "Microsoft Teams",
        meeting_date: group.meeting_date,
        meeting_time: group.meeting_time,
        user_id: group.student_id,
        owner: group.student ? `${group.student.name} ${group.student.surname}` : "Unknown",
        members: members.map(member => {
          const student = member.student;
          return student ? `${student.name} ${student.surname}` : "Unknown";
        })
      };
    });

    console.log("📊 Formatted groups:", formattedGroups.length);

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
// Get my study groups
// -----------------------------
router.get("/my-groups", authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    console.log("🔍 Fetching study groups for user ID:", studentId);

    const myGroups = await prisma.sessionMembers.findMany({
      where: { 
        student_id: Number(studentId) 
      },
      include: {
        session: {
          include: {
            members: {
              include: {
                student: {
                  select: {
                    name: true,
                    surname: true
                  }
                }
              }
            },
            student: {
              select: {
                name: true,
                surname: true,
                student_id: true
              }
            }
          }
        }
      }
    });
    
    console.log("✅ Found my groups via SessionMembers:", myGroups.length);

    const formattedGroups = myGroups.map(member => {
      const group = member.session;
      const members = group.members || [];
      
      return {
        id: group.session_id,
        group_name: group.group_name,
        module_name: group.module_name || "General",
        about: group.about || "No description",
        num_members: group.num_members || 8,
        meeting_link: group.meeting_link || "",
        meeting_platform: group.meeting_platform || "Microsoft Teams",
        meeting_date: group.meeting_date,
        meeting_time: group.meeting_time,
        user_id: group.student_id,
        owner: group.student ? `${group.student.name} ${group.student.surname}` : "Unknown",
        members: members.map(member => {
          const student = member.student;
          return student ? `${student.name} ${student.surname}` : "Unknown";
        })
      };
    });

    console.log("📊 Formatted my groups:", formattedGroups.length);

    res.json({ 
      success: true, 
      data: formattedGroups
    });
  } catch (err) {
    console.error("❌ Error fetching my study groups:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching study groups" 
    });
  }
});

// -----------------------------
// Create a new study group
// -----------------------------
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      group_name,
      module_name,
      about,
      num_members,
      meeting_link,
      meeting_platform,
      meeting_date,
      meeting_time
    } = req.body;

    const studentId = req.user.id;

    console.log("📝 Creating new study group:", {
      group_name, module_name, studentId
    });

    // Validate required fields
    if (!group_name || !module_name || !meeting_date) {
      return res.status(400).json({
        success: false,
        message: "Group name, module name, and meeting date are required"
      });
    }

    // Create new study session (group)
    const newGroup = await prisma.studySessions.create({
      data: {
        group_name: group_name,
        module_name: module_name,
        about: about,
        num_members: Number(num_members) || 8,
        meeting_link: meeting_link,
        meeting_platform: meeting_platform || "Microsoft Teams",
        meeting_date: new Date(meeting_date),
        meeting_time: meeting_time,
        student_id: Number(studentId)
      }
    });

    // Add creator as first member
    await prisma.sessionMembers.create({
      data: {
        session_id: newGroup.session_id,
        student_id: Number(studentId),
        joined_at: new Date()
      }
    });

    console.log("✅ Study group created successfully, ID:", newGroup.session_id);

    res.status(201).json({
      success: true,
      message: "Study group created successfully",
      data: newGroup
    });

  } catch (err) {
    console.error("❌ Error creating study group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while creating study group" 
    });
  }
});

// -----------------------------
// Update a study group
// -----------------------------
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      group_name,
      module_name,
      about,
      num_members,
      meeting_link,
      meeting_platform,
      meeting_date,
      meeting_time
    } = req.body;

    const studentId = req.user.id;

    console.log("📝 Updating study group:", id);

    // Check if user owns the group
    const existingGroup = await prisma.studySessions.findUnique({
      where: { session_id: Number(id) }
    });

    if (!existingGroup) {
      return res.status(404).json({
        success: false,
        message: "Study group not found"
      });
    }

    if (existingGroup.student_id !== Number(studentId)) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own study groups"
      });
    }

    const updatedGroup = await prisma.studySessions.update({
      where: { session_id: Number(id) },
      data: {
        group_name: group_name,
        module_name: module_name,
        about: about,
        num_members: Number(num_members),
        meeting_link: meeting_link,
        meeting_platform: meeting_platform,
        meeting_date: new Date(meeting_date),
        meeting_time: meeting_time
      }
    });

    console.log("✅ Study group updated successfully");

    res.json({
      success: true,
      message: "Study group updated successfully",
      data: updatedGroup
    });

  } catch (err) {
    console.error("❌ Error updating study group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating study group" 
    });
  }
});

// -----------------------------
// Delete a study group
// -----------------------------
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("🗑️ Deleting study group:", id, "by user:", studentId);

    // Check if user owns the group
    const existingGroup = await prisma.studySessions.findUnique({
      where: { session_id: Number(id) }
    });

    if (!existingGroup) {
      console.log("❌ Study group not found:", id);
      return res.status(404).json({
        success: false,
        message: "Study group not found"
      });
    }

    console.log("🔍 Group owner:", existingGroup.student_id, "Requesting user:", studentId);

    if (existingGroup.student_id !== Number(studentId)) {
      console.log("❌ User not authorized to delete this group");
      return res.status(403).json({
        success: false,
        message: "You can only delete your own study groups"
      });
    }

    // First delete all members (due to foreign key constraints)
    await prisma.sessionMembers.deleteMany({
      where: { session_id: Number(id) }
    });

    // Then delete the group
    await prisma.studySessions.delete({
      where: { session_id: Number(id) }
    });

    console.log("✅ Study group deleted successfully");

    res.json({
      success: true,
      message: "Study group deleted successfully"
    });

  } catch (err) {
    console.error("❌ Error deleting study group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting study group" 
    });
  }
});

// -----------------------------
// Join a study group
// -----------------------------
router.post("/:id/join", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("👥 User", studentId, "joining group", id);

    // Check if group exists and has space
    const group = await prisma.studySessions.findUnique({
      where: { session_id: Number(id) },
      include: {
        members: true
      }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found"
      });
    }

    // Check if user is already a member
    const existingMembership = await prisma.sessionMembers.findFirst({
      where: {
        session_id: Number(id),
        student_id: studentId
      }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this group"
      });
    }

    // Check if group is full
    const currentMembers = group.members.length;
    const maxMembers = group.num_members || 8;
    
    if (currentMembers >= maxMembers) {
      return res.status(400).json({
        success: false,
        message: "This study group is full"
      });
    }

    // Add member
    await prisma.sessionMembers.create({
      data: {
        session_id: Number(id),
        student_id: studentId,
        joined_at: new Date()
      }
    });

    console.log("✅ User joined group successfully");

    res.json({
      success: true,
      message: "Successfully joined the study group"
    });

  } catch (err) {
    console.error("❌ Error joining study group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while joining study group" 
    });
  }
});

// -----------------------------
// Leave a study group
// -----------------------------
router.post("/:id/leave", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    console.log("👥 User", studentId, "leaving group", id);

    // Check if user is the owner
    const group = await prisma.studySessions.findUnique({
      where: { session_id: Number(id) }
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Study group not found"
      });
    }

    if (group.student_id === Number(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Group owners cannot leave their own group. Please delete the group instead."
      });
    }

    // Remove member
    await prisma.sessionMembers.deleteMany({
      where: {
        session_id: Number(id),
        student_id: studentId
      }
    });

    console.log("✅ User left group successfully");

    res.json({
      success: true,
      message: "Successfully left the study group"
    });

  } catch (err) {
    console.error("❌ Error leaving study group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while leaving study group" 
    });
  }
});

export default router;