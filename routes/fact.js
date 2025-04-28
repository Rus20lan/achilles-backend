import express from "express";
import {
  getFactInValuesField,
  setFact,
  updateFact,
} from "../controllers/fact.js";

const router = express.Router();

router.get("/volumeId=:volumeId", setFact);
router.post("/save", setFact);

router.get("/:id/value/:idValue", getFactInValuesField);
router.put("/:id/value/:idValue", updateFact);

export { router };
