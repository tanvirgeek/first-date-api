import express from "express";
import { getSearchResult } from "../controllers/search.controller.js";

const router = express.Router()

router.get('/searchField', getSearchResult)


export default router