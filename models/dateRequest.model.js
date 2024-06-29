import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the SearchResult schema
const DateSpotSchema = new Schema({
    location: {
        latitude: Number,
        longitude: Number
    },
    name: String,
    address: String,
    url: String,
    phone: String,
    country: String,
    subAddress: String,
    city: String
});

// Define the DateRequest schema
const DateRequestSchema = new Schema({
    dateSpot: { type: DateSpotSchema, required: true },
    dateInitiator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const DateRequest = mongoose.model('DateRequest', DateRequestSchema);

export default DateRequest