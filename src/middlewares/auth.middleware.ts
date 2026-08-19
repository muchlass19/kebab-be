import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export class AuthMiddleware {
  verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Silakan login terlebih dahulu",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token!);
      req.user = decoded;
      next();
    } catch (error: any) {
      res
        .status(403)
        .json({
          message: "Token tidak valid atau sudah kadaluarsa!",
          log: error.message,
        });
    }
  };

  authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          message: "Silakan login terlebih dahulu",
        });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          message: "Akses ditolak",
        });
        return;
      }

      next();
    };
  };
}
