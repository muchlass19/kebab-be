import { Router } from "express";
import { PelangganController } from "../controllers/pelanggan.controller.ts";
import { AuthMiddleware } from "../middlewares/auth.middleware.ts";

const router: Router = Router();
const controller = new PelangganController();
const middleware = new AuthMiddleware();

router.get(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.findById,
);
router.put(
  "/:id/update-profile",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.updateProfile,
);
router.put(
  "/:id/change-password",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.changePassword,
);

export default router;
