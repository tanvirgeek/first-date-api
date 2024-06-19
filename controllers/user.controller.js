import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';

export const updatePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Old password and new password are required' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
}

export const updateUserIformation = async (req, res) => {
    const {
        fullname,
        interestedIn,
        attachmentStyle,
        gender,
        birthDate,
        country,
        city,
        bio,
        partnersBio,
        yearlyIncome,
        email
    } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields
        if (fullname) user.fullname = fullname;
        if (interestedIn) user.interestedIn = interestedIn;
        if (attachmentStyle) user.attachmentStyle = attachmentStyle;
        if (gender) user.gender = gender;
        if (birthDate) user.birthDate = birthDate;
        if (country) user.country = country;
        if (city) user.city = city;
        if (bio) user.bio = bio;
        if (partnersBio) user.partnersBio = partnersBio;
        if (yearlyIncome) user.yearlyIncome = yearlyIncome;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the user profile' });
    }

}


export const updateUserProfilePic = async (req, res) => {
    try {
        const { oldProfilePic } = req.body
        const user = await User.findById(req.user.userId)
        if (user) {
            // Get __dirname equivalent in ES modules
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            // Function to find the target directory
            function findTargetDir(targetDirName, startDir) {
                let currentDir = startDir;

                while (currentDir !== path.parse(currentDir).root) {
                    const targetDirPath = path.join(currentDir, targetDirName);
                    if (fs.existsSync(targetDirPath)) {
                        return targetDirPath;
                    }
                    currentDir = path.dirname(currentDir);
                }
                return null;
            }

            const targetDir = findTargetDir('first-date-api', __dirname);
            // Construct the full path to the file
            // @ts-ignore
            const filePath = path.join(targetDir, 'uploads', oldProfilePic);
            console.log(filePath)
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
            user.profilePic = req.file.path
            await user.save()
            res.status(200).json({ message: 'User profile picture successfully updated', profilePic: user.profilePic });
        } else {
            res.status(404).json({ error: 'No user found' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while updating the user profile pic' });
    }
}