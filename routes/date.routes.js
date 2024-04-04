import express from "express";
import { getPaginatedDates } from "../controllers/dates.controller.js";

const router = express.Router()

router.get("/", getPaginatedDates)

export default router