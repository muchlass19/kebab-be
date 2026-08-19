import type { Request, Response } from "express";
import { KeranjangService } from "../services/keranjang.service.ts";
import type { AuthRequest } from "../middlewares/auth.middleware.ts";

const keranjangService = new KeranjangService();

export class KeranjangController {
  get = async (req: AuthRequest, res: Response) => {
    try {
      const pelanggan_id = req.user?.id;

      if (!pelanggan_id) {
        res.status(401).json({ message: "Sesi login tidak valid" });
        return;
      }
      const data = await keranjangService.get(pelanggan_id);

      res.status(200).json({
        message: "Data keranjang berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  add = async (req: AuthRequest, res: Response) => {
    try {
      const pelanggan_id = req.user?.id;
      const { produk_id, qty } = req.body;

      if (!pelanggan_id) {
        res.status(401).json({ message: "Sesi login tidak valid" });
        return;
      }

      const data = await keranjangService.add(pelanggan_id, produk_id, qty);
      res.status(201).json({
        message: "Berhasil menambahkan produk ke keranjang",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateQty = async (req: AuthRequest, res: Response) => {
    try {
      const pelanggan_id = req.user?.id;
      const { qty, produk_id } = req.body;

      const data = await keranjangService.updateQty(
        pelanggan_id!,
        produk_id,
        qty,
      );

      res.status(200).json({
        message: "Berhasil update qty",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      await keranjangService.delete(id);

      res.status(200).json({
        message: "Berhasil hapus produk dari keranjang",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
