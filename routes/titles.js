import express from "express";
import passport from "passport";
import { getAllTitles, getTitlesByPage } from "../controllers/titles.js";
const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), getAllTitles);

router.get("/paginated", getTitlesByPage);

export { router };
