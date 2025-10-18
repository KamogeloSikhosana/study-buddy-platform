// src/routes/studyGroups.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET all groups
router.get("/all", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching all groups for user:", req.user.id);
    
    const allGroups = await prisma.studyGroups.findMany({
      include: {
        student: {
          select: {
            student_id: true,
            name: true,
            surname: true,
            email: true
          }
        }
      }
    });
    
    console.log(`Found ${allGroups.length} groups`);
    
    // Format response
    const formattedGroups = allGroups.map(group => ({
      id: group.group_id,
      group_name: group.group_name,
      module_name: group.module_name,
      about: group.about,
      num_members: group.num_members,
      meeting_platform: group.meeting_platform,
      meeting_link: group.meeting_link,
      meeting_date: group.meeting_date,
      meeting_time: group.meeting_time,
      user_id: group.user_id,
      owner: `${group.student.name} ${group.student.surname}`,
      members: [] // Empty for now
    }));
    
    res.json({ success: true, data: formattedGroups });
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET my groups
router.get("/my-groups", authenticateToken, async (req, res) => {
  try {
    console.log("Fetching my groups for user:", req.user.id);
    
    const myGroups = await prisma.studyGroups.findMany({
      where: { user_id: req.user.id },
      include: {
        student: {
          select: {
            student_id: true,
            name: true,
            surname: true,
            email: true
          }
        }
      }
    });
    
    console.log(`Found ${myGroups.length} of my groups`);
    
    // Format response
    const formattedGroups = myGroups.map(group => ({
      id: group.group_id,
      group_name: group.group_name,
      module_name: group.module_name,
      about: group.about,
      num_members: group.num_members,
      meeting_platform: group.meeting_platform,
      meeting_link: group.meeting_link,
      meeting_date: group.meeting_date,
      meeting_time: group.meeting_time,
      user_id: group.user_id,
      owner: `${group.student.name} ${group.student.surname}`,
      members: [] // Empty for now
    }));
    
    res.json({ success: true, data: formattedGroups });
  } catch (err) {
    console.error("Error fetching my groups:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// POST new group
router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log("Creating group for user:", req.user.id);
    console.log("Request body:", req.body);

    const {
      group_name,
      module_name,
      about,
      num_members,
      meeting_platform,
      meeting_link,
      meeting_date,
      meeting_time,
    } = req.body;

    // Validate required fields
    if (!group_name || !module_name || !meeting_link || !meeting_date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Create the group
    const newGroup = await prisma.studyGroups.create({
      data: {
        user_id: req.user.id,
        group_name,
        module_name,
        about: about || "",
        num_members: num_members || 8,
        meeting_platform: meeting_platform || "Microsoft Teams",
        meeting_link,
        meeting_date: new Date(meeting_date),
        meeting_time: meeting_time || "",
      },
      include: {
        student: {
          select: {
            name: true,
            surname: true
          }
        }
      }
    });

    console.log("Group created successfully:", newGroup);

    // Format response
    const formattedGroup = {
      id: newGroup.group_id,
      group_name: newGroup.group_name,
      module_name: newGroup.module_name,
      about: newGroup.about,
      num_members: newGroup.num_members,
      meeting_platform: newGroup.meeting_platform,
      meeting_link: newGroup.meeting_link,
      meeting_date: newGroup.meeting_date,
      meeting_time: newGroup.meeting_time,
      user_id: newGroup.user_id,
      owner: `${newGroup.student.name} ${newGroup.student.surname}`,
      members: [`${newGroup.student.name} ${newGroup.student.surname}`] // Creator is the first member
    };

    res.status(201).json({
      success: true,
      message: "Study group created successfully",
      data: formattedGroup,
    });
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: err.message 
    });
  }
});

// Debug route for testing authentication
router.get("/debug-auth", authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: "Authentication successful",
    user: req.user 
  });
});

// Export the router as default
export default router;