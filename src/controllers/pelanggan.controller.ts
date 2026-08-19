import type { Request, Response } from "express";
import { PelangganService } from "../services/pelanggan.service";
import type { AuthRequest } from "../middlewares/auth.middleware";

const pelangganService = new PelangganService();
export class PelangganController {
  findById = async (req: AuthRequest, res: Response) => {
    const id = Number(req.user?.id);
    if (!id) {
      res.status(401).json({ message: "Sesi login tidak valid" });
      return;
    }

    const data = await pelangganService.findById(id);
    res.status(200).json({
      message: "Berhasil mengambil data pelanggan",
      data,
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nama, username, alamat, no_hp, latitude, longitude } = req.body;

      const data = await pelangganService.updateProfile(
        id,
        nama,
        username,
        alamat,
        no_hp,
        latitude,
        longitude
      );

      res.status(200).json({
        message: "Berhasil update profil pelanggan",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { password, password_confirm } = req.body;

      const data = await pelangganService.changePassword(
        id,
        password,
        password_confirm,
      );

      res.status(200).json({
        message: "Berhasil update profil pelanggan",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
