import express from "express";
import { getDateRequestByIds, getMyMatches, getMydates, postDateRequest, updateDateStatus, updateIsSeen } from "../controllers/dateRequest.controller.js";


const router = express.Router()

router.post("/", postDateRequest)
router.get("/", getMydates)
router.put("/", updateDateStatus)
router.get("/matches", getMyMatches)
router.put("/seenTrue", updateIsSeen)
router.get("/getDateRequestByIds", getDateRequestByIds)

export default router