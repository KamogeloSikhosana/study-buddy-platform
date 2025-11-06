import express from "express";
import prisma from "../prismaClient.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all posts with filters
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 10 } = req.query;
    
    const where = {
      status: status && status !== 'all' ? status : 'published'
    };
    
    if (type && type !== 'all') {
      where.post_type = type;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const posts = await prisma.posts.findMany({
      where,
      include: {
        student: {
          select: {
            student_id: true,
            name: true,
            surname: true,
            profile_image: true
          }
        },
        comments: {
          include: {
            student: {
              select: {
                name: true,
                surname: true,
                profile_image: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        },
        post_likes: true
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.posts.count({ where });

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image_url: post.image_url,
      author: `${post.student.name} ${post.student.surname}`,
      authorId: post.student_id,
      createdAt: post.created_at,
      likes: post.post_likes.length,
      comments: post.comments.map(comment => ({
        id: comment.id,
        studentName: `${comment.student.name} ${comment.student.surname}`,
        studentId: comment.student_id,
        content: comment.content,
        createdAt: comment.created_at,
        likes: comment.likes
      })),
      views: post.views,
      status: post.status,
      type: post.post_type
    }));

    res.json({
      success: true,
      data: formattedPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCount: total
      }
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching posts" 
    });
  }
});

// Create a new post
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content, image, type, status } = req.body;
    const studentId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    // Handle image - only store URL or filename, not base64 data
    let imageUrl = null;
    if (image) {
      // For now, we'll just store a placeholder or skip the image
      // In a real app, you'd upload to cloud storage and store the URL
      imageUrl = "image_uploaded"; // Placeholder
    }

    const newPost = await prisma.posts.create({
      data: {
        title,
        content,
        image_url: imageUrl, // Store only URL, not base64 data
        post_type: type || 'question',
        status: status || 'published',
        student_id: Number(studentId)
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

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: newPost
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while creating post" 
    });
  }
});

// Update a post
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, type, status } = req.body;
    const studentId = req.user.id;

    // Check if post exists and user owns it
    const existingPost = await prisma.posts.findUnique({
      where: { id: Number(id) }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    if (existingPost.student_id !== Number(studentId)) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts"
      });
    }

    // Handle image - only store URL or filename, not base64 data
    let imageUrl = existingPost.image_url;
    if (image && image !== existingPost.image_url) {
      imageUrl = "image_updated"; // Placeholder
    }

    const updatedPost = await prisma.posts.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        image_url: imageUrl,
        post_type: type,
        status,
        updated_at: new Date()
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

    res.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost
    });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while updating post" 
    });
  }
});

// Delete a post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    // Check if post exists and user owns it
    const existingPost = await prisma.posts.findUnique({
      where: { id: Number(id) }
    });

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    if (existingPost.student_id !== Number(studentId)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts"
      });
    }

    await prisma.posts.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while deleting post" 
    });
  }
});

// Add a comment
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const studentId = req.user.id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required"
      });
    }

    const newComment = await prisma.comments.create({
      data: {
        content,
        post_id: Number(id),
        student_id: Number(studentId)
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

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: newComment
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while adding comment" 
    });
  }
});

// Like a post
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    // Check if already liked
    const existingLike = await prisma.post_likes.findFirst({
      where: {
        post_id: Number(id),
        student_id: Number(studentId)
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.post_likes.delete({
        where: { id: existingLike.id }
      });
    } else {
      // Like
      await prisma.post_likes.create({
        data: {
          post_id: Number(id),
          student_id: Number(studentId)
        }
      });
    }

    // Get updated like count
    const likeCount = await prisma.post_likes.count({
      where: { post_id: Number(id) }
    });

    res.json({
      success: true,
      message: existingLike ? "Post unliked" : "Post liked",
      likes: likeCount
    });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error while liking post" 
    });
  }
});

export default router;