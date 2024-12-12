const express = require('express');
const app = express();
const {userRouter} = require('./routes/user');
const {courseRouter} = require('./routes/course');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1//course', courseRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})