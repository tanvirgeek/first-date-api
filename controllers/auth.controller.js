import User from "../models/user.model.js";

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
            threeImages,
            password,
            email
        } = req.body;

        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ error: "Email already exists!" })
        } else {
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
                profileImage,
                threeImages,
                password,
                email
            });

            const savedUser = await newUser.save()
            res.status(201).json(savedUser)
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