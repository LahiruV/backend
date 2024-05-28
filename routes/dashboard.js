const express = require("express");
const Job = require("../models/jobs");
const userSchema = require("../models/user");
const Service = require("../models/service");
const Course = require("../models/course");
const router = express.Router();

// Get Statistics for Dashboard
// job Count , user Count, service Count
router.get("/stats/:addedUser", async (req, res) => {
  const { addedUser } = req.params;
  try {
    const userCount = await userSchema.countDocuments();
    const jobCount = await Job.countDocuments({ addedUser });
    const serviceCount = await Service.countDocuments({ addedUser });
    const courseCount = await Course.countDocuments({ addedUser });
    res.status(200).json({ jobCount, userCount, serviceCount, courseCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
