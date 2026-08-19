import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";
import { TransaksiService } from "../services/transaksi.service.ts";
import { KeranjangService } from "../services/keranjang.service.ts";

const transaksiService = new TransaksiService();
const keranjangService = new KeranjangService();

export class TransaksiController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const pelanggan_id = req.user?.id;
      const { items, transfer_upload } = req.body;

      if (!pelanggan_id) {
        res.status(401).json({ message: "Sesi login tidak valid!" });
        return;
      }

      const data = await transaksiService.createTransaksi(
        pelanggan_id,
        transfer_upload,
        items,
      );

      if (data) {
        await keranjangService.destroyCart(pelanggan_id);
      }

      res.status(200).json({
        message: "Transaksi berhasil dibuat",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getRiwayat = async (req: AuthRequest, res: Response) => {
    try {
      const pelangganId = req.user?.id;
      if (!pelangganId) {
        res.status(401).json({ message: "Sesi login tidak valid!" });
        return;
      }

      const data = await transaksiService.getRiwayatPelanggan(pelangganId);

      res.status(200).json({
        message: "Berhasil mengambil riwayat transaksi",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  getWaitingVerified = async (req: AuthRequest, res: Response) => {
    try {
      const data = await transaksiService.getWaitingVerified();
      res.status(200).json({
        message: "Berhasil mengambil data transaksi harian",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  getDailyTransaction = async (req: AuthRequest, res: Response) => {
    try {
      const { date } = req.body;
      if (!date) {
        res.status(400).json({ message: "Data tanggal harus diisi!" });
        return;
      }

      const data = await transaksiService.getDailyTransaction(date);
      res.status(200).json({
        message: "Berhasil mengambil data transaksi harian",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  findByInvoiceNumber = async (req: AuthRequest, res: Response) => {
    try {
      const invoiceNumber = req.params.id;
      if (!invoiceNumber) {
        res.status(400).json({ message: "Invoice number diisi!" });
        return;
      }

      const data = await transaksiService.findByInvoiceNumber(
        invoiceNumber.toString(),
      );
      res.status(200).json({
        message: "Berhasil mengambil detail transaksi",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  updatePaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
      const invoiceNumber = req.params.id;
      const { status_bayar } = req.body;
      if (!invoiceNumber) {
        res.status(400).json({ message: "Data tanggal harus diisi!" });
        return;
      }

      const data = await transaksiService.updatePaymentStatus(
        invoiceNumber.toString(),
        status_bayar,
      );
      res.status(200).json({
        message: "Berhasil update status pembayaran",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getReportByDateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { start_date, end_date, status } = req.body;
      if (!start_date || !end_date) {
        res.status(400).json({ message: "Data tanggal harus diisi!" });
        return;
      }

      const data = await transaksiService.getReportByDateStatus(
        start_date,
        end_date,
        status,
      );
      res.status(200).json({
        message: "Berhasil mengambil data report",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  getTransactionPengirimanByStatus = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const { status } = req.body;
      const data =
        await transaksiService.getTransactionPengirimanByStatus(status);

      res.status(200).json({
        message: "Berhasil mengambil data",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  };

  readyToDelivery = async (req: AuthRequest, res: Response) => {
    try {
      const pengiriman_id = req.user?.id!;
      const invoiceNumber = req.params.id!;
      if (!invoiceNumber) {
        res.status(400).json({ message: "Data tanggal harus diisi!" });
        return;
      }

      const data = await transaksiService.readyToDeliver(
        invoiceNumber.toString(),
        pengiriman_id,
      );
      res.status(200).json({
        message: "Berhasil update status pembayaran",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  finishingOrder = async (req: AuthRequest, res: Response) => {
    try {
      const invoiceNumber = req.params.id!;
      if (!invoiceNumber) {
        res.status(400).json({ message: "Data tanggal harus diisi!" });
        return;
      }

      const data = await transaksiService.finishingOrder(
        invoiceNumber.toString(),
      );
      res.status(200).json({
        message: "Berhasil update status pembayaran",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getTransactionByPelanggan = async (req: AuthRequest, res: Response) => {
    try {
      const pelanggan_id = req.user?.id!;

      const data =
        await transaksiService.getTransactionByPelanggan(pelanggan_id);
      res.status(200).json({
        message: "Berhasil ambil data transaksi",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
