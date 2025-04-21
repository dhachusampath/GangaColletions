const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // File system module to handle file deletion
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Register Endpoint
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Google OAuth Redirect
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${FRONTEND_URL}?token=${token}&userId=${req.user.id}`);
  }
);

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update isRetailer by User ID
router.put('/user/:userId/role', async (req, res) => {
    const { userId } = req.params;
    const { isRetailer } = req.body;
  
    try {
      // Find the user by ID and update the isRetailer field
      const user = await User.findByIdAndUpdate(
        userId,
        { isRetailer }, // Update isRetailer based on the new role
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Role updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating user role' });
    }
  });
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save to the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid naming conflicts
    },
  });
  
  const upload = multer({ storage });
  
  // Route to update profile (phone number and profile image)
  router.put("/user/:id", upload.single("profileImage"), async (req, res) => {
    try {
      const { id } = req.params;
      const { phone } = req.body;
      let profileImage = req.body.profileImage;
  
      // Find the existing user
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Handle image update: delete old image if a new one is uploaded
      if (req.file) {
        // Save the new image file path
        profileImage = req.file.filename;
  
        // Delete the old image if it exists and is not a placeholder
        if (existingUser.profileImage && existingUser.profileImage !== "placeholder.jpg") {
          const oldImagePath = `uploads/${existingUser.profileImage}`;
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error(`Failed to delete old image: ${oldImagePath}`, err);
            }
          });
        }
      }
  
      // Update user data (only update provided fields)
      const updatedFields = {
        ...(phone && { phone }),
        ...(profileImage && { profileImage }),
      };
  
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found after update" });
      }
  
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });

  router.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Fetch user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Respond with user data
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;

