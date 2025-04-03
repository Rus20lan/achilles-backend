import express from "express";
import passport from "passport";
import { getAllVolumes } from "../controllers/volumes.js";

const router = express.Router();

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   getAllVolumes
// );

router.get("/", getAllVolumes);

export { router };
