import express from "express";
import { updatePassword } from "../controllers/user.controller.js";

const router = express.Router()

router.put("/updatePassword", updatePassword)

export default router