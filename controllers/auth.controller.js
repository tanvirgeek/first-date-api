import User from "../models/user.model.js";
import multer from 'multer';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"

export const signup = async (req, res) => {
    try {
        const {
            fullname,
            interestedIn,
            attachmentStyle,
            gender,
            country,
            city,
            birthDate,
            bio,
            partnersBio,
            yearlyIncome,
            password,
            email
        } = req.body;

        const user = await User.findOne({ email })
        if (user) {
            // If user exists, delete the uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
            res.status(400).json({ error: "Email already exists!" })
        } else {
            if (req.file.path) {
                // If the images are successfully uploaded, you can save their paths to the database or perform any other action here
                // @ts-ignore
                const salt = await bcrypt.genSalt(10)
                const hashedpassword = await bcrypt.hash(password, salt)

                const newUser = new User({
                    fullname,
                    interestedIn,
                    attachmentStyle,
                    gender,
                    country,
                    city,
                    birthDate,
                    bio,
                    partnersBio,
                    yearlyIncome,
                    profilePic: req.file.path,
                    password: hashedpassword,
                    email,
                });

                const savedUser = await newUser.save()
                // @ts-ignore
                savedUser.password = undefined

                if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
                    const accessToken = jwt.sign({ userId: savedUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    const refreshToken = jwt.sign({ userId: savedUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });
                    res.status(201).json({ savedUser, accessToken, refreshToken })
                }


            } else {
                res.status(400).json({ message: 'No images uploaded' });
            }

        }

    } catch (error) {
        res.status(500).json({ error: "Something is wrong!", exactError: error })
    }
}

export const refreshToken = (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    if (process.env.REFRESH_TOKEN_SECRET) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (process.env.ACCESS_TOKEN_SECRET) {
                const accessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                res.json({ accessToken });
            }
        });
    }
}


// Login endpoint
export const signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }
        if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
            const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });
            // @ts-ignore
            user.password = undefined
            res.json({ user, accessToken, refreshToken });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
}

export const signout = (req, res) => {
    res.send("sign out users")
}

// Set up multer storage
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Filter for image files
export const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};