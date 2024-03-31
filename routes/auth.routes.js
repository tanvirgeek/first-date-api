import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const router = express.Router()

router.post("/login", signin)

router.post("/register", signup)

router.post("/logout", signout)

export default router