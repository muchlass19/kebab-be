import type { Request, Response } from "express";
import { ProdukService } from "../services/produk.service";

const produkService = new ProdukService();

export class ProdukController {
  getAll = async (req: Request, res: Response) => {
    try {
      const data = await produkService.getAll();

      res.status(200).json({
        message: "Data produk berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { nama, harga, stok, gambar, is_available } = req.body;
      const data = await produkService.create(
        nama,
        harga,
        stok,
        gambar,
        is_available,
      );

      res.status(201).json({
        message: "Berhasil membuat data produk",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nama, harga, stok, gambar, is_available } = req.body;

      const data = await produkService.update(
        id,
        nama,
        harga,
        stok,
        gambar,
        is_available,
      );

      res.status(200).json({
        message: "Berhasil update data produk",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await produkService.delete(id);

      res.status(200).json({
        message: "Berhasil hapus data produk",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await produkService.findById(id);

      res.status(200).json({
        message: "Data produk berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  findAllProducts = async (req: Request, res: Response) => {
    try {
      const data = await produkService.findAllProducts();
      res.status(200).json({
        message: "Data produk berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
