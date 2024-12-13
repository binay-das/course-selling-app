const { Router } = require('express');
const { adminsModel } = require('../db');
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