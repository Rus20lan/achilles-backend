import express from "express";
import { setFact } from "../controllers/fact.js";

const router = express.Router();

router.get("/volumeId=:volumeId", setFact);
router.post("/save", setFact);

export { router };
