const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const Enroll = require("../models/enroll");

// Create a new course
router.post("/create", async (req, res) => {
  try {
    const { image, title, description, duration, poststart, addedUser } =
      req.body;
    const newCourse = new Course({
      image,
      title,
      description,
      duration,
      poststart,
      addedUser,
    });
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a course
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update user fields
    for (let field in updates) {
      if (updates.hasOwnProperty(field)) {
        course[field] = updates[field];
      }
    }

    // Save updated course
    await course.save();

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a course
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res
      .status(200)
      .json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get("/allForUser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allCourses = await Course.find().populate("addedUser");

    const enrolledDetails = await Enroll.find({ userID: id });

    const filterCourses = [];
    allCourses.forEach((course) => {
      //  check if the course is enrolled by the user
      const found = enrolledDetails.find(
        (enroll) => enroll.courseID.toString() === course._id.toString()
      );

      filterCourses.push({
        ...course._doc,
        isEnrolled: found ? true : false,
      });
    });

    res.status(200).json(filterCourses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get ALl courses by added user
router.get("/all/:addedUser", async (req, res) => {
  try {
    const { addedUser } = req.params;
    const courses = await Course.find({ addedUser }).populate("addedUser");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get enrolled courses by user
router.get("/allEnroll/:addedUser", async (req, res) => {
  try {
    const { addedUser } = req.params;

    let enrollData = [];

    // get user add courses
    const courses = await Course.find({ addedUser });

    // get enroll data for each course
    for (let i = 0; i < courses.length; i++) {
      const courseEnroll = await Enroll.find({
        courseID: courses[i]._id,
      }).populate("userID courseID");
      enrollData = enrollData.concat(courseEnroll);
    }

    res.status(200).json({ enrollData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course enroll count for added user
router.get("/count/:addedUser", async (req, res) => {
  const { addedUser } = req.params;
  try {
    let enrollData = [];

    // get user add courses
    const courses = await Course.find({ addedUser });

    // get enroll data for each course
    for (let i = 0; i < courses.length; i++) {
      const courseEnroll = await Enroll.find({
        courseID: courses[i]._id,
      });
      enrollData = enrollData.concat(courseEnroll);
    }

    res.status(200).json({ count: enrollData.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
