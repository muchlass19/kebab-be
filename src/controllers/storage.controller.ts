import type { Request, Response } from "express";
import { StorageService } from "../services/storage.service";

const storageService = new StorageService();

export class StorageController {
  createPresignedUrl = async (req: Request, res: Response) => {
    try {
      const { filename, contentType } = req.body;

      if (!filename || !contentType) {
        return res.status(400).json({
          message: "Filename dan contentType wajib diisi",
        });
      }

      const data = await storageService.createPresignedUrl(
        filename,
        contentType,
      );

      res.status(200).json({
        message: "Presigned URL berhasil dibuat",
        data,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
}
