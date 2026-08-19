import type { Request, Response } from "express";
import { DivisiService } from "../services/divisi.service";

const divisiService = new DivisiService();

export class DivisiController {
  getAll = async (req: Request, res: Response) => {
    try {
      const results = await divisiService.getAll();

      res.status(200).json({
        message: "Data divisi berhasil diambil",
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { nama } = req.body;
      const result = await divisiService.create(nama);

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nama } = req.body;
      const result = await divisiService.update(id, nama);

      res.status(200).json({
        message: "Berhasil update data",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await divisiService.delete(id);

      res.status(200).json({
        message: "Berhasil menghapus data",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await divisiService.findById(id);

      res.status(200).json({
        message: "Data divisi berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getForDropdown = async (req: Request, res: Response) => {
    try {
      const data = await divisiService.getForDropdown();

      res.status(200).json({
        message: "Data dropdown divisi berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
