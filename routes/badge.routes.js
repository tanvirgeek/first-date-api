import express from "express";
import { getBadgeCount, resetDateMessageBadgeCount, resetDateRequestsBadgeCount, decreaseOneMessageBadgeCount } from "../controllers/badge.controller.js";

const router = express.Router()

router.put('/reset-unread-messages-count', resetDateMessageBadgeCount)
router.get('/badge-counts', getBadgeCount)
router.put('/reset-unread-dateRequests-count', resetDateRequestsBadgeCount)
router.put('/decrease-message-badge-count', decreaseOneMessageBadgeCount)

export default router