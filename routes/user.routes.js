import express from "express";
import { updatePassword, updateUserIformation, updateUserProfilePic } from "../controllers/user.controller.js";
import { fileFilter, storage } from "../controllers/auth.controller.js";

import multer from "multer";

const router = express.Router()
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.put("/updatePassword", updatePassword)
router.put("/updateUserInfo", updateUserIformation)
router.put("/updateProfilePic", upload.single("profilePic"), updateUserProfilePic)

export default router