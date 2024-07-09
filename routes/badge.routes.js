import express from "express";
import { getBadgeCount, resetDateMessageBadgeCount, resetDateRequestsBadgeCount } from "../controllers/badge.controller.js";

const router = express.Router()

router.put('/reset-unread-messages-count', resetDateMessageBadgeCount)
router.get('/badge-counts', getBadgeCount)
router.put('/reset-unread-dateRequests-count', resetDateRequestsBadgeCount)

export default router