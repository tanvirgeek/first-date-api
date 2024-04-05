import express from "express";
import { deleteSessionUsers, getPaginatedUsersFromCity } from "../controllers/users.controller.js";

const router = express.Router()

router.get("/", getPaginatedUsersFromCity)

router.delete("/session-users", deleteSessionUsers)

export default router