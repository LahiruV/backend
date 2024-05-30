const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const MathsJson = require("../exams/maths.json");
const ScienceJson = require("../exams/science.json");

// GET: Retrieve all admin users
router.get("/getmathsQuiz", async (req, res) => {
  const filePath = path.join(__dirname, "../exams/maths.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const quizData = JSON.parse(data);
      return res.status(200).json(quizData);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

router.get("/getscienceQuiz", async (req, res) => {
  const filePath = path.join(__dirname, "../exams/science.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const quizData = JSON.parse(data);
      return res.status(200).json(quizData);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

// router.get("/getModuleDetail/:module/:userId", async (req, res) => {
//   const { module, userId } = req.params;
//   enum levels {
//     "Beginner" = 0,
//     "Intermediate" = 1,
//     "Advanced" = 2,
//   }

//   try {
//     const user = await userSchema.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let response;
//     if (module === "maths") {
//       let mathsLevel = user.mathsexam.length
//         ? user.mathsexam[user.mathsexam.length - 1]
//         : null;

//         response = {
//           level: mathsLevel?.level ? mathsLevel?.level : "Beginner",
//           score: mathsLevel?.score ? mathsLevel?.score : 0,
//           questions: MathsJson[mathsLevel?.level] || MathsJson["Beginner"],
//         };

//         let currentLevel = levels[mathsLevel?.level];
//         let nextLevel = currentLevel + 1;

//         if(mathsLevel?.score >= 70){
//           if(nextLevel <= 2){
//             response["nextLevel"] = levels[nextLevel];
//             response["questions"] = MathsJson[levels[nextLevel]];
//             response["score"] = 0;
//           } else {
//             response["nextLevel"] = levels[currentLevel];
//           }
//         }

//     } else if (module === "science") {
//       let scienceLevel = user.scienceexam.length
//         ? user.scienceexam[user.scienceexam.length - 1]
//         : null;

//       response = {
//         level: scienceLevel?.level ? scienceLevel?.level : "Beginner",
//         questions: ScienceJson[scienceLevel?.level] || ScienceJson["Beginner"],
//         score: scienceLevel?.score ? scienceLevel?.score : 0,
//       };

//       let currentLevel = levels[scienceLevel?.level];
//       let nextLevel = currentLevel + 1;

//       if(scienceLevel?.score >= 70){
//         if(nextLevel <= 2){
//           response["nextLevel"] = levels[nextLevel];
//           response["questions"] = ScienceJson[levels[nextLevel]];
//           response["score"] = 0;
//         } else {
//           response["nextLevel"] = levels[currentLevel];
//         }
//       }
//     }

//     res.status(200).json(response);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/getModuleDetail/:module/:userId", async (req, res) => {
  const { module, userId } = req.params;

  const levels = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
  };

  try {
    const user = await userSchema.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let response;
    if (module === "maths") {
      let mathsLevel = user.mathsexam.length
        ? user.mathsexam[user.mathsexam.length - 1]
        : null;

      response = {
        level: mathsLevel && mathsLevel.level ? mathsLevel.level : "Beginner",
        score: mathsLevel && mathsLevel.score ? mathsLevel.score : 0,
        questions:
          MathsJson[
            mathsLevel && mathsLevel.level ? mathsLevel.level : "Beginner"
          ],
      };

      let currentLevel =
        levels[mathsLevel && mathsLevel.level ? mathsLevel.level : "Beginner"];
      let nextLevel = currentLevel + 1;

      if (mathsLevel && mathsLevel.score >= 70) {
        if (nextLevel <= 2) {
          response["level"] = Object.keys(levels)[nextLevel];
          response["questions"] = MathsJson[Object.keys(levels)[nextLevel]];
          response["score"] = 0;
        } else {
          response["level"] = Object.keys(levels)[currentLevel];
        }
      }
    } else if (module === "science") {
      let scienceLevel = user.scienceexam.length
        ? user.scienceexam[user.scienceexam.length - 1]
        : null;

      response = {
        level:
          scienceLevel && scienceLevel.level ? scienceLevel.level : "Beginner",
        questions:
          ScienceJson[
            scienceLevel && scienceLevel.level ? scienceLevel.level : "Beginner"
          ],
        score: scienceLevel && scienceLevel.score ? scienceLevel.score : 0,
      };

      let currentLevel =
        levels[
          scienceLevel && scienceLevel.level ? scienceLevel.level : "Beginner"
        ];
      let nextLevel = currentLevel + 1;

      if (scienceLevel && scienceLevel.score >= 70) {
        if (nextLevel <= 2) {
          response["level"] = Object.keys(levels)[nextLevel];
          response["questions"] = ScienceJson[Object.keys(levels)[nextLevel]];
          response["score"] = 0;
        } else {
          response["level"] = Object.keys(levels)[currentLevel];
        }
      }
    }

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
