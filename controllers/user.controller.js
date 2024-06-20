import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import ImageGallery from "../models/imageGallery.model.js";

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
            const filePath = path.join(targetDir, 'uploads', 'profileImages', req.user.userId, oldProfilePic);
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

export const uploadGalleryImages = async (req, res) => {
    const userId = req.user.userId;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const imageUrls = req.files.map(file => path.join('uploads', 'imageGallery', userId, file.filename));

    try {
        // Find existing gallery for user or create a new one
        let gallery = await ImageGallery.findOne({ userId: userId });
        if (gallery) {
            res.status(200).json({ error: 'Gallery Already Exists' });
        } else {
            gallery = new ImageGallery({ userId, images: imageUrls });
            await gallery.save();
            res.status(200).json({ message: 'Images uploaded successfully.', gallery });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while saving the images.' });
    }
}
// Ensure you have the correct path to your model

// Controller function to fetch gallery images
export const fetchGalleryImages = async (req, res) => {
    const userId = req.user.userId;

    try {
        // Find the gallery for the user
        const gallery = await ImageGallery.findOne({ userId: userId });

        if (!gallery) {
            return res.status(200).json({ error: 'Gallery not found' });
        }

        // Return the gallery images
        res.status(200).json({ gallery });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the gallery images.' });
    }
}


export const deleteSingleImageFromGallery = async (req, res) => {
    const { imageName } = req.query;
    const userId = req.user.userId;

    const imagePath = path.join('uploads', 'imageGallery', userId, imageName);

    try {
        // Find the gallery for the user
        const gallery = await ImageGallery.findOne({ userId: userId });
        if (!gallery) {
            return res.status(404).json({ error: 'User gallery not found' });
        }

        // Check if the image exists in the gallery
        const imageIndex = gallery.images.indexOf(imagePath);
        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found in gallery' });
        }

        // Remove the image file from the file system
        fs.unlink(imagePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'An error occurred while deleting the image file' });
            }

            // Remove the image URL from the gallery in the database
            gallery.images.splice(imageIndex, 1);
            await gallery.save();

            res.status(200).json({ message: 'Image deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the image' });
    }
}

export const updateImageGallery = async (req, res) => {
    const userId = req.user.userId;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
    }

    try {
        // Find the gallery for the user
        let gallery = await ImageGallery.findOne({ userId: userId });
        if (!gallery) {
            return res.status(404).json({ error: 'User gallery not found' });
        }

        // Check how many images can be added without exceeding the limit
        const remainingSlots = 9 - gallery.images.length;
        if (remainingSlots <= 0) {
            return res.status(400).json({ error: 'Image gallery is full.' });
        }

        const imagesToAdd = req.files.slice(0, remainingSlots);
        const imageUrls = imagesToAdd.map(file => path.join('uploads', 'imageGallery', userId, file.filename));

        // Append the new images to the gallery
        gallery.images.push(...imageUrls);
        await gallery.save();

        res.status(200).json({ message: 'Images added successfully.', gallery });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the images.' });
    }
}



// config/multerConfig.js
export const storageGallery = multer.diskStorage({
    destination: function (req, file, cb) {
        // @ts-ignore
        const userId = req.user.userId;
        const uploadPath = path.join('uploads', 'imageGallery', userId);
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

export const uploadGallery = multer({
    storage: storageGallery,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB max file size
        files: 9 // Maximum number of files
    }
});

export const storageUpadateImageGallery = multer.diskStorage({
    destination: function (req, file, cb) {
        // @ts-ignore
        const userId = req.user.userId;
        const uploadPath = path.join('uploads', 'imageGallery', userId);

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

export const uploadUpdateImageGallery = multer({
    storage: storageUpadateImageGallery,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB max file size
        files: 8 // Maximum number of files
    }
});
