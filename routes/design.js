import express from "express";
import passport from "passport";
import {
  getDesignById,
  saveDesign,
  updateDesign,
  deleteDesign,
} from "../controllers/design.js";

const router = express.Router();

// router.get(
//   "/:id",
//   passport.authenticate("jwt", { session: false }),
//   getDesignById
// );
router.get("/:id", getDesignById);
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  saveDesign
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateDesign
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteDesign
);

export { router };
