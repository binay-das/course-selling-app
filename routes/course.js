const { Router } = require('express');
const courseRouter = Router();
const { userMiddleware } = require('../middlewares/user');
const { purchasesModel, coursesModel } = require('../db');

courseRouter.get('/preview', async (req, res) => {

    try {
        const courses = await coursesModel.find({});

        res.json({ courses });
    } catch (error) {
        return res.status(404).json({
            message: 'No course found',
            error: error.message
        });
    }
});

courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    const userId = req.userId;
    const { courseId } = req.body;
    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
    }

    await purchasesModel.create({
        userId,
        courseId
    });

    res.status(200).json({ message: 'Purchase successful!' });

})

module.exports = {
    courseRouter
}