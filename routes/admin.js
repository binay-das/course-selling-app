const { Router } = require('express');
const { adminsModel, coursesModel } = require('../db');
const { adminMiddleware } = require('../middlewares/admin');
const adminRouter = Router();

adminRouter.post('/signup', async (req, res) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(100, { message: "Password must be less than 100 characters" })
            .regex(strongPasswordRegex, {
                message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
            }),
        firstName: z.string().min(3).max(100),
        lastName: z.string().min(3).max(100).optional()
    });

    const safeParsedData = requiredBody.safeParse(req.body);
    if (safeParsedData.error) {
        return res.status(400).json({ message: 'Invalid data', errors: safeParsedData.error });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
        const existingAdmin = await adminsModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = await adminsModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })

        return res.status(200).json({
            message: 'User created successfully',
            User: newUser
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

adminRouter.post('/signin', async (req, res) => {
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const safeParsedData = requiredBody.safeParse(req.body);
    if (safeParsedData.error) {
        return res.status(400).json({ message: 'Invalid data', errors: safeParsedData.error });
    }

    const { email, password } = req.body;

    const admin = await adminsModel.findOne({ email });

    if (!admin) {
        return res.status(401).json({ message: 'email not registered' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        adminId: admin._id,
    }, process.env.JWT_ADMIN_SECRET);

    res.status(200).json({
        message: 'Logged in successfully',
        token,
        admin
    });
})

adminRouter.post('/course', adminMiddleware, async (req, res) => {
    const adminId = req.userId;

    const { title, description, price, imgUrl, creatorId } = req.body;

    try {
        const newCourse = await adminsModel.create({
            title,
            description,
            price,
            imgUrl,
            creatorId: adminId
        });

        return res.status(200).json({
            message: 'Course created successfully',
            newCourse
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

adminRouter.put('/course/:id', adminMiddleware, async (req, res) => {
    const adminId = req.userId;

    const { title, description, price, imgUrl, courseId } = req.body;

    const { id } = req.params;

    try {
        const course = await coursesModel.updateOne(
            {
                _id: courseId,
                creatorId: adminId
            },
            {
                title,
                description,
                price,
                imgUrl
            }
        );

        res.status(200).json({
            message: 'Course updated successfully',
            courseId
        });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
})

adminRouter.delete('/course/:id', adminMiddleware, async (req, res) => {
    const adminId = req.userId;

    const { id } = req.params;

    try {
        const course = await coursesModel.deleteOne({
            _id: id,
            creatorId: adminId
        });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
})

adminRouter.get('/course/bulk', adminMiddleware, async (req, res) => {
    // retrieve all courses

    const adminId = req.userId;

    try {
        const courses = await coursesModel.find({
            creatorId: adminId
        });

        return res.status(200).json({
            message: 'Courses retrieved successfully',
            courses
        });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
})

module.exports = {
    adminRouter
}