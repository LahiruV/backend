const adminSchema = require("../models/admin");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// POST: Register a new admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, image } = req.body;

    // Check if the email already exists
    const existingUser = await adminSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already used" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new adminSchema({
      name,
      email,
      phone,
      password: hashedPassword,
      image,
    });

    // Save the admin
    await admin.save();
    res.status(201).json({ message: "Admin member added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const existingUser = await adminSchema.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    // Respond success on correct credentials
    res.status(200).json({ message: "Login successful", existingUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve all admin users
router.get("/getAll", async (req, res) => {
  try {
    // Select all but exclude password field
    const admins = await adminSchema.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve an admin by ID
router.get("/get/:id", async (req, res) => {
  try {
    // Extract the ID from the request parameters
    const { id } = req.params;

    // Find the admin by ID in the database
    const admin = await adminSchema.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Return the found admin
    res.status(200).json(admin);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE an admin by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to find and remove the admin by ID
    const admin = await adminSchema.findByIdAndDelete(id);

    // If no admin found, send a 404 response
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send back a success message
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    // Log the error and return a 500 response
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PUT: Update an entire admin by ID, with password hashing
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const adminUpdates = req.body;

  try {
    // If a new password is provided, hash it
    if (adminUpdates.password) {
      const hashedPassword = await bcrypt.hash(adminUpdates.password, 10);
      adminUpdates.password = hashedPassword;
    }

    // Find the admin by ID and update it with the new data
    // { new: true } option returns the document after update was applied
    const updatedAdmin = await adminSchema.findByIdAndUpdate(id, adminUpdates, {
      new: true,
      runValidators: true,
    });

    // If no admin found, send a 404 response
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send back the updated admin data, excluding the password field
    const result = updatedAdmin.toObject();
    delete result.password;
    res.status(200).json(result);
  } catch (error) {
    // Handle possible errors
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
