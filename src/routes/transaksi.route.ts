import { Router } from "express";
import { TransaksiController } from "../controllers/transaksi.controller.ts";
import { AuthMiddleware } from "../middlewares/auth.middleware.ts";

const router: Router = Router();
const controller = new TransaksiController();
const middleware = new AuthMiddleware();

router.get(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.getRiwayat,
);
router.post(
  "/",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.create,
);
router.post(
  "/daily",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.getDailyTransaction,
);
router.get(
  "/pelanggan",
  middleware.verifyToken,
  middleware.authorizeRoles("Pelanggan"),
  controller.getTransactionByPelanggan,
);
router.post(
  "/report",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner"),
  controller.getReportByDateStatus,
);
router.post(
  "/pengiriman",
  middleware.verifyToken,
  middleware.authorizeRoles("Pengiriman"),
  controller.getTransactionPengirimanByStatus,
);
router.put(
  "/siap-kirim/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Pengiriman"),
  controller.readyToDelivery,
);
router.put(
  "/selesai-order/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Pengiriman"),
  controller.finishingOrder,
);
router.put(
  "/status-bayar/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin", "Pengiriman"),
  controller.updatePaymentStatus,
);
router.get(
  "/waiting-verified",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin"),
  controller.getWaitingVerified,
);
router.get(
  "/:id",
  middleware.verifyToken,
  middleware.authorizeRoles("Owner", "Admin", "Pengiriman"),
  controller.findByInvoiceNumber,
);

export default router;
