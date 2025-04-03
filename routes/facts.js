import express from "express";
import passport from "passport";
import { getAllFacts } from "../controllers/facts.js";

const router = express.Router();

// router.get("/", passport.authenticate("jwt", { session: false }), getAllFacts);
router.get("/", getAllFacts);

export { router };
