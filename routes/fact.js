import express from "express";
import { getFactInValuesField, setFact } from "../controllers/fact.js";

const router = express.Router();

router.get("/volumeId=:volumeId", setFact);
router.post("/save", setFact);

router.get("/:id/value/:idValue", getFactInValuesField);

export { router };
