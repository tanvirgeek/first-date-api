import express from "express";
import { storageGallery, updatePassword, updateUserIformation, updateUserProfilePic, uploadGalleryImages } from "../controllers/user.controller.js";
import { fileFilter, storage } from "../controllers/auth.controller.js";

import multer from "multer";

const router = express.Router()
const upload = multer({ storage: storage, fileFilter: fileFilter });
const galleryUpload = multer({ storage: storageGallery, fileFilter: fileFilter });

router.put("/updatePassword", updatePassword)
router.put("/updateUserInfo", updateUserIformation)
router.put("/updateProfilePic", upload.single("profilePic"), updateUserProfilePic)
router.post("/uploadGalleryImages", galleryUpload.array('images', 9), uploadGalleryImages)

export default router