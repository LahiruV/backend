const Service = require("../models/service");
const router = require("express").Router();

// Add service
router.post("/add", async (req, res) => {
  try {
    const { title, description, image, addedUser } = req.body;
    const newService = new Service({ title, description, addedUser });
    await newService.save();
    res.json({ message: "Service added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all services for added user
router.get("/all/:addedUser", async (req, res) => {
  try {
    const { addedUser } = req.params;
    const services = await Service.find({ addedUser }).populate("addedUser");
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all services for all users
router.get("/all", async (req, res) => {
  try {
    const services = await Service.find().populate("addedUser");
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a service by id
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update user fields
    for (let field in updates) {
      if (updates.hasOwnProperty(field)) {
        service[field] = updates[field];
      }
    }

    // Save updated user
    await service.save();

    return res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a service by id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await Service.findByIdAndDelete(id);
    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get a service by id
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id).populate("addedUser");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
