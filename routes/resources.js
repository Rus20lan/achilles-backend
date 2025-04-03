import express from "express";
import passport from "passport";
import { getAllResources } from "../controllers/resources.js";

const router = express.Router();

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   getAllResources
// );

router.get("/", getAllResources);

export { router };
