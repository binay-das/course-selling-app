const express = require('express');
const app = express();
require('dotenv').config();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1//course', courseRouter);
app.use('/api/v1//admin', adminRouter);

async function main(req, res) {
    try {
        await mongoose.connect(process.env.DB_URL);

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        return res.status(404).json({ error: error });
    }
}

main();