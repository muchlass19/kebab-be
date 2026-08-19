import express from "express";
import type { Express } from "express";
import cors from "cors";

import authRoute from "./routes/auth.route";
import divisiRoute from "./routes/divisi.route";
import karyawanRoute from "./routes/karyawan.route";
import produkRoute from "./routes/produk.route";
import pelangganRoute from "./routes/pelanggan.route";
import keranjangRoute from "./routes/keranjang.route";
import transaksiRoute from "./routes/transaksi.route";
import storageRoute from "./routes/storage.route";

const app: Express = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "API Running",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/divisi", divisiRoute);
app.use("/api/karyawan", karyawanRoute);
app.use("/api/produk", produkRoute);
app.use("/api/pelanggan", pelangganRoute);
app.use("/api/keranjang", keranjangRoute);
app.use("/api/transaksi", transaksiRoute);
app.use("/api/storage", storageRoute);

export default app;
