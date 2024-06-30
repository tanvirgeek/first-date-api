import express from "express";
import { getMydates, postDateRequest, updateDateStatus } from "../controllers/dateRequest.controller.js";


const router = express.Router()

router.post("/", postDateRequest)
router.get("/", getMydates)
router.put("/", updateDateStatus)

export default router