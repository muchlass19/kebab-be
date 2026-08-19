import express from "express";
import type { Express } from "express";
import cors from "cors";

import authRoute from "./routes/auth.route.ts";
import divisiRoute from "./routes/divisi.route.ts";
import karyawanRoute from "./routes/karyawan.route.ts";
import produkRoute from "./routes/produk.route.ts";
import pelangganRoute from "./routes/pelanggan.route.ts";
import keranjangRoute from "./routes/keranjang.route.ts";
import transaksiRoute from "./routes/transaksi.route.ts";
import storageRoute from "./routes/storage.route.ts";

const app: Express = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

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
