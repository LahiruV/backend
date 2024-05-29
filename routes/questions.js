const express = require('express');
const router = express.Router();

// GET: Retrieve all admin users
router.get('/getmathsQuiz', async (req, res) => {
    const filePath = path.join(__dirname, '../exams/maths.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      try {
        const quizData = JSON.parse(data);
        return res.status(200).json(quizData);
      } catch (parseError) {
        console.error('Error parsing JSON data:', parseError);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
});


module.exports = router;
