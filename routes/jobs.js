const router = require("express").Router();
const adminSchema = require("../models/admin");
const Apply = require("../models/apply");
const Job = require("../models/jobs");

// Add a new job
router.post("/add", async (req, res) => {
  try {
    const { title, experience, salary, description, endingdate, addedUser } =
      req.body;

    const user = await adminSchema.findById(addedUser);

    if (!user.companyInformation) {
      return res
        .status(400)
        .json({ message: "Add company information before adding a job" });
    }

    // Create a new job instance
    const newJob = new Job({
      title,
      experience,
      salary,
      description,
      endingdate,
      addedUser,
    });

    // Save the job to the database
    await newJob.save();

    // Respond with success message
    res.status(201).json({ message: "Job added successfully", job: newJob });
  } catch (error) {
    // Handle potential errors
    res.status(400).json({ error: error.message });
  }
});

// Get all jobs
router.get("/all/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const appliedJobs = await Apply.find({ userId: userId });

    const jobs = await Job.find().populate("addedUser"); // Assuming you want to populate the 'addedUser' details

    const filterJobs = [];

    jobs.forEach((job) => {
      const found = appliedJobs.find((appliedJob) => {
        return appliedJob.jobId.toString() === job._id.toString();
      });

      filterJobs.push({
        ...job._doc,
        applied: found ? true : false,
      });
    });

    res.status(200).json(filterJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all jobs for a specific added user
router.get("/all/:addedUserId", async (req, res) => {
  try {
    const { addedUserId } = req.params;
    const jobs = await Job.find({ addedUser: addedUserId }).populate(
      "addedUser"
    ); // Populate to include user details
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a job
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, experience, salary, description, endingdate } = req.body;
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        title,
        experience,
        salary,
        description,
        endingdate,
      },
      { new: true, runValidators: true }
    ); // new: true returns the updated document, runValidators: true applies schema validation on update

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a job
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.remove();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
