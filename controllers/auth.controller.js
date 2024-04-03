import User from "../models/user.model.js";
import multer from 'multer';

export const signup = async (req, res) => {
    try {
        const {
            fullname,
            interestedIn,
            attachmentStyle,
            gender,
            country,
            isStudent,
            studyTopic,
            profession,
            doesHaveApurpose,
            purpose,
            doYouReadBooks,
            books,
            musicians,
            favoriteFoods,
            favoriteMovies,
            favoriteDrinks,
            favoriteSportsTeam,
            doesLikeTravelling,
            doesHavePet,
            aboutPet,
            languages,
            partnersAgeRangeMax,
            partnersAgeRangeMin,
            birthDate,
            shortStory,
            profileImage,
            password,
            email
        } = req.body;

        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ error: "Email already exists!" })
        } else {
            if (req.files) {
                // If the images are successfully uploaded, you can save their paths to the database or perform any other action here
                // @ts-ignore
                const imagePaths = req.files.map((file) => file.path);
                const newUser = new User({
                    fullname,
                    interestedIn,
                    attachmentStyle,
                    gender,
                    country,
                    isStudent,
                    studyTopic,
                    profession,
                    doesHaveApurpose,
                    purpose,
                    doYouReadBooks,
                    books,
                    musicians,
                    favoriteFoods,
                    favoriteMovies,
                    favoriteDrinks,
                    favoriteSportsTeam,
                    doesLikeTravelling,
                    doesHavePet,
                    aboutPet,
                    languages,
                    partnersAgeRangeMax,
                    partnersAgeRangeMin,
                    birthDate,
                    shortStory,
                    profileImage: imagePaths[0],
                    password,
                    email,
                    threeImages: imagePaths
                });

                const savedUser = await newUser.save()
                res.status(201).json(savedUser)
            } else {
                res.status(400).json({ message: 'No images uploaded' });
            }

        }

    } catch (error) {
        res.status(500).json({ error: "Something is wrong!" })
    }
}

export const signin = (req, res) => {
    res.send("sign in users")
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