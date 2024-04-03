import express from "express";
import { fileFilter, refreshToken, signin, signout, signup, storage } from "../controllers/auth.controller.js";
import multer from 'multer';

const router = express.Router()

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/login", signin)

router.post("/register", upload.array('images', 3), signup)

router.post("/logout", signout)

router.post('/token', refreshToken);

export default router