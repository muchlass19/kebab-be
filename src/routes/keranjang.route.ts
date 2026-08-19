import { Router } from "express";
import { KeranjangController } from "../controllers/keranjang.controller.ts";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();
const controller = new KeranjangController();
const middleware = new AuthMiddleware();

router.get(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.get,
);
router.post(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.add,
);
router.put(
  "/update-qty",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.updateQty,
);
router.delete(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.delete,
);

export default router;
