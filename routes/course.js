const { Router } = require('express');
const courseRouter = Router();

courseRouter.get('/preview', (req, res) => {
    res.json({ message: 'Welcome to the course API!' });
});

courseRouter.post('/purchase', (req, res) => {
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
    }
})

module.exports = {
    courseRouter
}