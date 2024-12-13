const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1//course', courseRouter);
app.use('/api/v1/admin', adminRouter);

async function main(req, res) {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to DB');

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log('Error:', error);
    }
}

main();