import { prisma } from "../lib/prisma.ts";
import { StatusPengiriman } from "../../generated/prisma/enums";
import type { TransaksiItem } from "../types/transaksi.type";

export class TransaksiRepository {
  create = (
    no_trx: string,
    pelanggan_id: number,
    total_bayar: number,
    jarak_km: number,
    transfer_upload: string,
    items: TransaksiItem[],
  ) => {
    return prisma.transaksi.create({
      data: {
        no_trx,
        pelanggan_id,
        total_bayar,
        jarak_km,
        transfer_upload,
        transaksiDetail: {
          create: items.map((item) => ({
            produk_id: item.produk_id,
            qty: item.qty,
            harga_satuan: item.harga_satuan,
            subtotal: item.qty * item.harga_satuan,
          })),
        },
      },
      include: { transaksiDetail: true },
    });
  };

  getByPelangganId = (pelanggan_id: number) => {
    return prisma.transaksi.findMany({
      where: { pelanggan_id },
      include: {
        transaksiDetail: {
          include: { produk: true },
        },
      },
      orderBy: { tanggal_trx: "desc" },
    });
  };

  getWaitingVerified = () => {
    return prisma.transaksi.findMany({
      where: {
        status: "MENUNGGU_VERIFIKASI",
      },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
      orderBy: { createdAt: "asc" },
    });
  };

  getByDateRange = (start_date: Date, end_date: Date) => {
    return prisma.transaksi.findMany({
      where: {
        tanggal_trx: {
          gte: start_date,
          lte: end_date,
        },
        status: "DITERIMA",
      },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
      orderBy: { createdAt: "desc" },
    });
  };

  findByNoTrx = (no_trx: string) => {
    return prisma.transaksi.findFirst({
      where: { no_trx },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
    });
  };

  updatePaymentStatus = (
    no_trx: string,
    status_bayar: boolean,
    status: StatusPengiriman,
  ) => {
    return prisma.transaksi.update({
      where: { no_trx },
      data: { status_bayar, status },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
    });
  };

  getReportByDateStatus = (
    start_date: Date,
    end_date: Date,
    status: StatusPengiriman,
  ) => {
    return prisma.transaksi.findMany({
      where: {
        tanggal_trx: {
          gte: start_date,
          lte: end_date,
        },
        ...(status && {
          status,
        }),
      },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
      orderBy: { createdAt: "desc" },
    });
  };

  findLastTransaction = () => {
    return prisma.transaksi.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  findPelangganUnique = (id: number) => {
    return prisma.pelanggan.findUnique({
      where: { id },
    });
  };

  // pengiriman
  getTransactionPengiriman = (status: StatusPengiriman) => {
    return prisma.transaksi.findMany({
      where: {
        status,
      },
      include: {
        pelanggan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  updatePengiriman = (
    no_trx: string,
    status: StatusPengiriman,
    pengiriman_id: number,
    estimasi_waktu: number,
    waktu_berangkat: Date,
  ) => {
    return prisma.transaksi.update({
      where: {
        no_trx,
      },
      data: { status, pengiriman_id, estimasi_waktu, waktu_berangkat },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
    });
  };

  updateSelesaiOrder = (
    no_trx: string,
    status: StatusPengiriman,
    waktu_tiba_aktual: Date,
  ) => {
    return prisma.transaksi.update({
      where: {
        no_trx,
      },
      data: { status, waktu_tiba_aktual },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
        pelanggan: true,
      },
    });
  };

  getTransactionByPelanggan = (pelanggan_id: number) => {
    return prisma.transaksi.findMany({
      where: {
        pelanggan_id,
      },
      include: {
        transaksiDetail: {
          include: {
            produk: true,
          },
        },
      },
    });
  };
}
