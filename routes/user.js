const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userSchema = require("../models/user");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      image,
      exam
    } = req.body;

    // Check if the email is already in use
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      image,
      exam
    });

    // Save the new user to the database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update user details including password
router.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    // Check if the user exists
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    for (let field in updates) {
      if (updates.hasOwnProperty(field)) {
        // Check if the field is 'password', then hash it
        if (field === "password") {
          const hashedPassword = await bcrypt.hash(updates[field], 10);
          user[field] = hashedPassword;
        } else {
          user[field] = updates[field];
        }
      }
    }

    // Save updated user
    await user.save();

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
router.get("/getAll", async (req, res) => {
  try {
    const users = await userSchema.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Check if the user exists
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await userSchema.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/addCourse/:id", async (req, res) => {
  const userId = req.params.id;
  const body = req.body.data;

  try {
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let message = "";
    let uniqueId = generateId();

    user.exam.push({ ...body, id: uniqueId });
    message = "Exam Completed successfully";
    await user.save();
    return res.status(200).json({ message: message });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function generateId() {
  return (
    new Date().getTime().toString(36) + Math.random().toString(36).slice(2)
  );
}

module.exports = router;
