const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const url = process.env.ATLAS_URI;
global.URL = url;

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB connection successfully");
});

const admin = require("./routes/admin.js");
app.use("/admin", admin);

const user = require("./routes/user.js");
app.use("/user", user);

const jobs = require("./routes/jobs.js");
app.use("/jobs", jobs);

const apply = require("./routes/apply.js");
app.use("/apply", apply);

const friend = require("./routes/friend.js");
app.use("/friend", friend);

const conversation = require("./routes/conversation.js");
app.use("/conversation", conversation);

const service = require("./routes/service.js");
app.use("/service", service);

const course = require("./routes/course.js");
app.use("/course", course);

const enroll = require("./routes/enroll.js");
app.use("/enroll", enroll);

const dashboard = require("./routes/dashboard.js");
app.use("/dashBoard", dashboard);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
