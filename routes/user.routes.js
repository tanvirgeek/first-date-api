import express from "express";
import { fetchGalleryImages, uploadGallery, updatePassword, updateUserIformation, updateUserProfilePic, uploadGalleryImages, deleteSingleImageFromGallery, uploadUpdateImageGallery, updateImageGallery } from "../controllers/user.controller.js";
import { fileFilter, storage } from "../controllers/auth.controller.js";

import multer from "multer";

const router = express.Router()
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.put("/updatePassword", updatePassword)
router.put("/updateUserInfo", updateUserIformation)
router.put("/updateProfilePic", upload.single("profilePic"), updateUserProfilePic)
router.post("/uploadGalleryImages", uploadGallery.array('images', 9), uploadGalleryImages)
router.delete("/deleteSingleImageFromGallery", deleteSingleImageFromGallery)
router.put("/updateImageGallery", uploadUpdateImageGallery.array('images', 8), updateImageGallery)
router.get("/fetchGallery", fetchGalleryImages)

export default router