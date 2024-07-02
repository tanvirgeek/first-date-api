import express from "express";
import { getMyMatches, getMydates, postDateRequest, updateDateStatus } from "../controllers/dateRequest.controller.js";


const router = express.Router()

router.post("/", postDateRequest)
router.get("/", getMydates)
router.put("/", updateDateStatus)
router.get("/matches", getMyMatches)

export default router