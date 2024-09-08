import User from "../models/user.model.js";
import multer from 'multer';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";

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
            email,
            profilePic
        } = req.body;

        const user = await User.findOne({ email })
        if (user) {
            res.status(200).json({ error: "Email already exists!" })
        } else {
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
                profilePic: profilePic,
                password: hashedpassword,
                email,
            });

            const savedUser = await newUser.save()
            // @ts-ignore
            savedUser.password = undefined

            if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
                const accessToken = jwt.sign({ userId: savedUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ userId: savedUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30y' });
                res.status(201).json({ savedUser, accessToken, refreshToken })
            }
        }
    } catch (error) {
        console.log(error)
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
            return res.status(200).send({ error: 'User not found' });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(200).send({ error: 'Invalid password' });
        }
        console.log(user.isDeleted, "isDeleted")
        if (user.isDeleted == true) {
            user.isDeleted = false
            await user.save()
        }

        if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
            const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '20y' });
            // @ts-ignore
            user.password = undefined
            res.json({ user, accessToken, refreshToken });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in');
    }
}

export const uploadProfilePic = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded.' });
    }

    const imageUrl = path.join('uploads', 'profileImages', req.user.userId, req.file.filename);

    try {
        // Update user's profilePic field
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.profilePic = imageUrl;
        await user.save();

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the profile picture.' });
    }
}

export const signout = (req, res) => {
    res.send("sign out users")
}

// Set up multer storage
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // @ts-ignore
        const userId = req.user.userId;
        const uploadPath = path.join('uploads', 'profileImages', userId);

        // Check if the directory exists, if not, create it
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err, uploadPath);
            }
            cb(null, uploadPath);
        });
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter for image files
export const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};