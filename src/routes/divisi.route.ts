import { Router } from "express";
import { DivisiController } from "../controllers/divisi.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();
const controller = new DivisiController();
const middleware = new AuthMiddleware();

router.get(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.getAll,
);
router.post(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.create,
);
router.get(
  "/dropdown",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.getForDropdown,
);
router.get(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.findById,
);
router.put(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.update,
);
router.delete(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.delete,
);

export default router;
