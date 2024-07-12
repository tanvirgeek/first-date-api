import express from "express";
import { getSearchResult, searchUsers } from "../controllers/search.controller.js";

const router = express.Router()

router.get('/searchField', getSearchResult)
router.post('/advancedSearch', searchUsers);


export default router