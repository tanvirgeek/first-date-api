// models/ImageGallery.js
import mongoose from 'mongoose';

const ImageGallerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        required: true
    }
});

const ImageGallery = mongoose.model('ImageGallery', ImageGallerySchema);

export default ImageGallery;
