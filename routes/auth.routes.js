import express from "express";

const router = express.Router()

router.get("/login", (req, res) => {
    res.send("I am login")
})

export default router