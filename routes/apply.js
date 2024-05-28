const express = require("express");
const router = express.Router();
const Apply = require("../models/apply");
const Job = require("../models/jobs");

// Add a new application
router.post("/add", async (req, res) => {
  try {
    const { userId, jobId, companyName, position, experience, email } =
      req.body;

    const existingApplication = await Apply.find({ userId, jobId });
    if (existingApplication.length > 0) {
      return res.status(400).json({ error: "Your application already exists" });
    }

    const application = new Apply({
      userId,
      jobId,
      companyName,
      position,
      experience,
      email,
    });
    await application.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Get all applications with jobId populated
router.get("/all", async (req, res) => {
  try {
    const applications = await Apply.find().populate("jobId");
    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Get all application for added job publisher user
router.get("/all/:id", async (req, res) => {
  // added admin id
  const { id } = req.params;
  try {
    let applications = [];

    // get user added jobs
    const jobs = await Job.find({ addedUser: id });

    // get applications for each job
    for (let i = 0; i < jobs.length; i++) {
      const jobApplications = await Apply.find({ jobId: jobs[i]._id }).populate(
        "jobId userId "
      );
      applications = applications.concat(jobApplications);
    }

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application count for added job publisher user
router.get("/count/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let applications = [];

    // get user added jobs
    const jobs = await Job.find({ addedUser: id });

    // get applications for each job
    for (let i = 0; i < jobs.length; i++) {
      const jobApplications = await Apply.find({ jobId: jobs[i]._id });
      applications = applications.concat(jobApplications);
    }

    res.status(200).json({ count: applications.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
