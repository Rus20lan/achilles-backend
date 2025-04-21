import express from "express";
import passport from "passport";
import {
  deleteResource,
  getResourceById,
  saveResource,
  updateResource,
} from "../controllers/resource.js";

const router = express.Router();

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getResourceById
);
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  saveResource
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateResource
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteResource
);

export { router };
