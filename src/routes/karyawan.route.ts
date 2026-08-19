import { Router } from "express";
import { KaryawanController } from "../controllers/karyawan.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();
const controller = new KaryawanController();
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
router.put(
  "/:id/change-password",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin", "Pengiriman"),
  controller.changePassword,
);

export default router;
