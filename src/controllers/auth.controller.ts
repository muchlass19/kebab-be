import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";

const authService = new AuthService();

export class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const data = await authService.login(username, password);

      res.status(200).json({
        message: "Berhasil login",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { nama, username, password, password_confirm } = req.body;
      const data = await authService.register(
        nama,
        username,
        password,
        password_confirm,
      );

      res.status(201).json({
        message: "Berhasil membuat akun pelanggan",
        data,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
