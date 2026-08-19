import { Router } from "express";
import { StorageController } from "../controllers/storage.controller";

const router: Router = Router();
const controller = new StorageController();

router.post("/", controller.createPresignedUrl);

export default router;
