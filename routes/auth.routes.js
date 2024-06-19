import express from "express";
import { fileFilter, refreshToken, signin, signout, signup, storage, uploadProfilePic } from "../controllers/auth.controller.js";
import multer from 'multer';
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router()

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/login", signin)

router.post("/register", signup)

router.post("/uploadProfilePic", verifyToken, upload.single("profilePic"), uploadProfilePic)

router.post("/logout", signout)

router.post('/token', refreshToken);

export default router