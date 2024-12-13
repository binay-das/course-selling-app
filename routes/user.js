const { Router } = require('express');
const userRouter = Router(); // Instantiate the router
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const { usersModel } = require('../db');
const jwt = require('jsonwebtoken');


userRouter.post('/signup', async (req, res) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const requiredBody = z.object({
        email: z.string().min(3).max(100).email().required(),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .max(100, { message: "Password must be less than 100 characters" })
            .regex(strongPasswordRegex, {
                message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
            })
            .required(),
        firstName: z.string().min(3).max(100).required(),
        lastName: z.string().min(3).max(100)
    });

    const safeParsedData = requiredBody.safeParse(req.body);
    if (safeParsedData.error) {
        return res.status(400).json({ message: 'Invalid data', errors: safeParsedData.error });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        const newUser = await usersModel.create({
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

userRouter.post('/signin', async (req, res) => {

    const requiredBody = z.object({
        email: z.string().email().required(),
        password: z.string().required()
    });

    const safeParsedData = requiredBody.safeParse(req.body);
    if (safeParsedData.error) {
        return res.status(400).json({ message: 'Invalid data', errors: safeParsedData.error });
    }

    const { email, password } = req.body;

    const user = await usersModel.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'email not registered' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_USER_SECRET);

    res.status(200).json({
        message: 'Logged in successfully',
        token,
        user
    });

})

module.exports = {
    userRouter
}