import { Router } from "express";
import { ProdukController } from "../controllers/produk.controller.ts";
import { AuthMiddleware } from "../middlewares/auth.middleware.ts";

const router: Router = Router();
const controller = new ProdukController();
const middleware = new AuthMiddleware();

router.get(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.getAll,
);
router.post(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.create,
);
router.put(
  "/delete/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.delete,
);
router.get(
  "/pelanggan-home",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.findAllProducts,
);
router.get(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.findById,
);
router.put(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.update,
);

export default router;
