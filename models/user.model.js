import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    interestedIn: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    attachmentStyle: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    country: {
        type: String,
        required: true
    },
    isStudent: {
        type: Boolean,
        required: true
    },
    studyTopic: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    doesHaveApurpose: {
        type: Boolean,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    doYouReadBooks: {
        type: Boolean,
        required: true
    },
    books: {
        type: [String],
        required: true
    },
    musicians: {
        type: [String],
        required: true
    },
    favoriteFoods: {
        type: [String],
        required: true
    },
    favoriteMovies: {
        type: [String],
        required: true
    },
    favoriteDrinks: {
        type: [String],
        required: true
    },
    favoriteSportsTeam: {
        type: [String],
        required: true
    },
    doesLikeTravelling: {
        type: Boolean,
        required: true
    },
    doesHavePet: {
        type: Boolean,
        required: true
    },
    aboutPet: {
        type: String,
        required: true
    },
    languages: {
        type: [String],
        required: true
    },
    partnersAgeRangeMax: {
        type: Number,
        required: true
    },
    partnersAgeRangeMin: {
        type: Number,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    shortStory: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    threeImages: {
        type: [String],
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

const User = mongoose.model("User", userSchema)
export default User

/*
case interestedIn = "Interested In?"
    case attachmentStyle = "Your attachment style?"
    case name = "Your Name?"
    case gender = "Your gender?"
    case country = "Your country?"
    case city = "Your city?"
    case isStudent = "Are you a student?"
    case studyTopic = "What do you study?"
    case profession = "Whats your profession?"
    case doesHaveAPurpose = "Do you have a long term life purpose?"
    case purpose = "Whats your life purpose?"
    case doYouReadBooks = "Do you love reading books?"
    case books = "Favorite book?"
    case movies = "Favorite movies?"
    case musicians = "Favourite musicians?"
    case favoriteFoods = "Foods you like?"
    case favoriteDrinks = "Drinks you like?"
    case sportsTeams = "Favorite Sports Teams?"
    case doesLikeTravelling = "Do you like travelling?"
    case doYouhaveAPet = "Do you have a pet?"
    case tellMeAboutYourPet = "Tell me about your pet"
    case languagesYouSpeak = "Languages you speak"
    case partnersAge = "Your partners age range?"
    case birthDay = "Your birth date?"
    case shortStory = "Write a short story about your life."
    case images = "Your three photos"
*/