import express from "express";
import passport from "passport";
import { getAllDesign } from "../controllers/designs.js";

const router = express.Router();

// router.get("/", passport.authenticate("jwt", { session: false }), getAllDesign);

router.get("/", getAllDesign);

export { router };
