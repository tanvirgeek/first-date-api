import express from "express";
import { getMydates, postDateRequest } from "../controllers/dateRequest.controller.js";


const router = express.Router()

router.post("/", postDateRequest)
router.get("/", getMydates)

export default router