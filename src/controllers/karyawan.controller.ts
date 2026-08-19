import type { Request, Response } from "express";
import { KaryawanService } from "../services/karyawan.service";

const karyawanService = new KaryawanService();

export class KaryawanController {
  getAll = async (req: Request, res: Response) => {
    try {
      const data = await karyawanService.getAll();

      res.status(200).json({
        message: "Data karyawan berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { nama, username, password, password_confirm, divisi_id } =
        req.body;
      const data = await karyawanService.create(
        nama,
        username,
        password,
        password_confirm,
        divisi_id,
      );

      res.status(201).json({
        message: "Berhasil membuat akun karyawan",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nama, username, divisi_id } = req.body;

      const data = await karyawanService.update(id, nama, username, divisi_id);

      res.status(200).json({
        message: "Berhasil update data karyawan",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await karyawanService.delete(id);

      res.status(200).json({
        message: "Berhasil hapus data karyawan",
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = await karyawanService.findById(id);

      res.status(200).json({
        message: "Data karyawan berhasil diambil",
        data,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { password, password_confirm } = req.body;

      const data = await karyawanService.changePassword(
        id,
        password,
        password_confirm,
      );

      res.status(200).json({
        message: "Berhasil ubah password",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
