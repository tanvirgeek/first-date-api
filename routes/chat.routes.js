import express from "express";
import { getChatPeople, getChats, markMessageAsSeen, saveChat } from "../controllers/chat.controller.js";


const router = express.Router()

router.post("/save", saveChat)
router.get("/chats", getChats)
router.get("/people", getChatPeople)
router.put("/markSeen", markMessageAsSeen)

export default router