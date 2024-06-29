import express from "express";
import { postDateRequest } from "../controllers/dateRequest.controller.js";


const router = express.Router()

router.post("/", postDateRequest)

export default router