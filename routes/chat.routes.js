import express from "express";
import { getChatPeople, getChats, saveChat } from "../controllers/chat.controller.js";


const router = express.Router()

router.post("/save", saveChat)
router.get("/chats", getChats)
router.get("/people", getChatPeople)

export default router