// routes/tasks.js
import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET all tasks for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const student_id = req.user.id; // Use req.user.id instead of req.user.student_id
    console.log("Fetching tasks for user:", student_id);
    
    const [tasks] = await db.query(
      `SELECT 
        task_id,
        student_id,
        title,
        type,
        priority,
        DATE(date) as date,
        time,
        description,
        completed,
        created_at,
        updated_at
       FROM tasks 
       WHERE student_id = ? 
       ORDER BY date ASC, time ASC`,
      [student_id]
    );

    console.log(`Found ${tasks.length} tasks for user ${student_id}`);
    
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message
    });
  }
});

// GET task by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = req.user.id; // Fixed
    
    const [tasks] = await db.query(
      `SELECT * FROM tasks 
       WHERE task_id = ? AND student_id = ?`,
      [id, student_id]
    );

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.json({
      success: true,
      data: tasks[0]
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message
    });
  }
});

// POST create new task
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, type, priority, date, time, description } = req.body;
    const student_id = req.user.id; // Fixed - use req.user.id

    console.log("Creating task for user:", student_id, req.body);

    // Validation
    if (!title || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Title, date, and time are required"
      });
    }

    // Combine date and time into a proper datetime format for MySQL
    const datetime = new Date(date + 'T' + time).toISOString().slice(0, 19).replace('T', ' ');
    console.log("Combined datetime for MySQL:", datetime);

    const [result] = await db.query(
      `INSERT INTO tasks 
       (student_id, title, type, priority, date, time, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [student_id, title, type, priority, datetime, time, description || null]
    );

    // Fetch the created task
    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ?",
      [result.insertId]
    );

    console.log("Task created successfully:", tasks[0]);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: tasks[0]
    });
  } catch (error) {
    console.error("Error creating task:", error);
    console.error("SQL Error:", error.sqlMessage);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
      sqlError: error.sqlMessage
    });
  }
});

// PUT update task
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, priority, date, time, description, completed } = req.body;
    const student_id = req.user.id; // Fixed

    console.log("Updating task:", id, req.body);

    // Check if task exists and belongs to user
    const [existingTasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ? AND student_id = ?",
      [id, student_id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Update task
    await db.query(
      `UPDATE tasks 
       SET title = ?, type = ?, priority = ?, date = ?, time = ?, 
           description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
       WHERE task_id = ? AND student_id = ?`,
      [
        title || existingTasks[0].title,
        type || existingTasks[0].type,
        priority || existingTasks[0].priority,
        date || existingTasks[0].date,
        time || existingTasks[0].time,
        description !== undefined ? description : existingTasks[0].description,
        completed !== undefined ? completed : existingTasks[0].completed,
        id,
        student_id
      ]
    );

    // Fetch updated task
    const [updatedTasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ?",
      [id]
    );

    console.log("Task updated successfully:", updatedTasks[0]);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTasks[0]
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message
    });
  }
});

// PATCH update task completion status
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const student_id = req.user.id; // Fixed

    console.log("Updating task completion:", id, completed);

    if (completed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Completed status is required"
      });
    }

    // Check if task exists and belongs to user
    const [existingTasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ? AND student_id = ?",
      [id, student_id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Update completion status
    await db.query(
      `UPDATE tasks 
       SET completed = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE task_id = ? AND student_id = ?`,
      [completed, id, student_id]
    );

    // Fetch updated task
    const [updatedTasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ?",
      [id]
    );

    console.log("Task completion updated successfully:", updatedTasks[0]);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTasks[0]
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message
    });
  }
});

// DELETE task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = req.user.id; // Fixed

    console.log("Deleting task:", id, "for user:", student_id);

    // Check if task exists and belongs to user
    const [existingTasks] = await db.query(
      "SELECT * FROM tasks WHERE task_id = ? AND student_id = ?",
      [id, student_id]
    );

    if (existingTasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Delete task
    await db.query(
      "DELETE FROM tasks WHERE task_id = ? AND student_id = ?",
      [id, student_id]
    );

    console.log("Task deleted successfully:", id);

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message
    });
  }
});

// GET today's tasks
router.get("/today", authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const student_id = req.user.id; // Fixed
    
    const [tasks] = await db.query(
      `SELECT *, DATE(date) as date FROM tasks 
       WHERE student_id = ? AND DATE(date) = ? 
       ORDER BY time ASC`,
      [student_id, today]
    );

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error("Error fetching today's tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching today's tasks",
      error: error.message
    });
  }
});

// GET upcoming tasks
router.get("/upcoming", authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const student_id = req.user.id; // Fixed
    
    const [tasks] = await db.query(
      `SELECT *, DATE(date) as date FROM tasks 
       WHERE student_id = ? AND DATE(date) >= ? AND completed = false
       ORDER BY date ASC, time ASC 
       LIMIT 10`,
      [student_id, today]
    );

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching upcoming tasks",
      error: error.message
    });
  }
});

export default router;