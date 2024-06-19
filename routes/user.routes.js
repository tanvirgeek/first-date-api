import express from "express";
import { updatePassword, updateUserIformation } from "../controllers/user.controller.js";

const router = express.Router()

router.put("/updatePassword", updatePassword)
router.put("/updateUserInfo", updateUserIformation)

export default router