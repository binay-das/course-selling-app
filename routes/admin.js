const { Router } = require('express');
const adminRouter = Router();

adminRouter.post('/signup', () => {

})

adminRouter.post('/signin', () => {

})

adminRouter.post('/course', (req, res) => {

})

adminRouter.put('/course/:id', (req, res) => {

})

adminRouter.delete('/course/:id', (req, res) => {

})

adminRouter.get('/course/bulk', (req, res) => {
    // retrieve all courses
})

module.exports = {
    adminRouter
}