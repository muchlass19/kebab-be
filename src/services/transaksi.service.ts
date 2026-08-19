import { StatusPengiriman } from "../../generated/prisma/enums";
import { TransaksiRepository } from "../repositories/transaksi.repository.ts";
import type { TransaksiItem } from "../types/transaksi.type";
import { hitungEstimasiTiba, hitungJarak } from "../utils/osrm";
import { getStorageUrl } from "../utils/storage";

export class TransaksiService {
  private repo = new TransaksiRepository();

  createTransaksi = async (
    pelanggan_id: number,
    transfer_upload: string,
    items: TransaksiItem[],
  ) => {
    if (!items || items.length === 0) {
      throw new Error("Pesanan kosong!");
    }

    const pelanggan = await this.repo.findPelangganUnique(pelanggan_id);
    if (!pelanggan) {
      throw new Error("Pelanggan tidak ditemukan");
    }

    let totalBayar = 0;
    items.forEach((item) => {
      totalBayar += item.qty * item.harga_satuan;
    });

    let jarakKm = 0;

    if (pelanggan.latitude && pelanggan.longitude) {
      const latitudeGudang = -6.3921;
      const longitudeGudang = 106.7461;

      const kalkulasiJarak = await hitungJarak(
        latitudeGudang,
        longitudeGudang,
        pelanggan.latitude,
        pelanggan.longitude,
      );

      jarakKm = kalkulasiJarak.jarakKm;
    }

    const lastTransaction = await this.repo.findLastTransaction();
    let sequence = 1;

    if (lastTransaction && lastTransaction.no_trx.startsWith("INV")) {
      const lastNumberString = lastTransaction.no_trx.replace("INV", "");
      const lastSequence = parseInt(lastNumberString, 10);

      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    const no_trx = `INV${String(sequence).padStart(3, "0")}`;

    const transaksi = await this.repo.create(
      no_trx,
      pelanggan_id,
      totalBayar,
      jarakKm,
      transfer_upload,
      items,
    );
    return { transaksi };
  };

  getRiwayatPelanggan = async (pelanggan_id: number) => {
    const data = await this.repo.getByPelangganId(pelanggan_id);
    return { data };
  };

  getWaitingVerified = async () => {
    const data = await this.repo.getWaitingVerified();
    const totalQty = data.reduce((total, trx) => {
      return (
        total +
        trx.transaksiDetail.reduce((subtotal, detail) => {
          return subtotal + detail.qty;
        }, 0)
      );
    }, 0);

    const totalBayar = data.reduce((total, trx) => {
      return total + trx.total_bayar;
    }, 0);
    const transactions = data.map((trx) => {
      return {
        invoiceNumber: trx.no_trx,
        date: trx.tanggal_trx.toISOString(),
        customerName: trx.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: trx.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        totalProduct: trx.transaksiDetail.length,
        total: trx.total_bayar,
        transferEvidence: getStorageUrl(trx.transfer_upload),
        status: trx.status,
      };
    });

    return { transactions, totalBayar, totalQty };
  };

  getDailyTransaction = async (date: Date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const data = await this.repo.getByDateRange(startDate, endDate);
    const totalQty = data.reduce((total, trx) => {
      return (
        total +
        trx.transaksiDetail.reduce((subtotal, detail) => {
          return subtotal + detail.qty;
        }, 0)
      );
    }, 0);

    const totalBayar = data.reduce((total, trx) => {
      return total + trx.total_bayar;
    }, 0);
    const transactions = data.map((trx) => {
      return {
        invoiceNumber: trx.no_trx,
        date: trx.tanggal_trx.toISOString(),
        customerName: trx.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: trx.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        totalProduct: trx.transaksiDetail.length,
        total: trx.total_bayar,
        transferEvidence: getStorageUrl(trx.transfer_upload),
        status: trx.status,
      };
    });

    return { transactions, totalBayar, totalQty };
  };

  findByInvoiceNumber = async (no_trx: string) => {
    const data = await this.repo.findByNoTrx(no_trx);
    return {
      transaction: {
        invoiceNumber: data?.no_trx,
        date: data?.tanggal_trx.toISOString(),
        customerName: data?.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: data?.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        total: data?.total_bayar,
        transferEvidence: getStorageUrl(data?.transfer_upload),
        status: data?.status,
        customerAddress:
          data?.pelanggan.alamat || "Alamat Pelanggan Tidak diketahui",
        customerMapLink: `https://maps.google.com?q=${data?.pelanggan.latitude},${data?.pelanggan.longitude}`,
      },
    };
  };

  updatePaymentStatus = async (no_trx: string, status_bayar: boolean) => {
    let status: StatusPengiriman = StatusPengiriman.DITOLAK;
    if (status_bayar) {
      status = StatusPengiriman.DIPROSES;
    }
    const data = await this.repo.updatePaymentStatus(
      no_trx,
      status_bayar,
      status,
    );
    return {
      transaction: {
        invoiceNumber: data?.no_trx,
        date: data?.tanggal_trx.toISOString(),
        customerName: data?.pelanggan.nama || "Pelanggan Tidak diketahui",
        customerAddress: data?.pelanggan.alamat || "Alamat Pelanggan Tidak diketahui",
        products: data?.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        total: data?.total_bayar,
        transferEvidence: data?.transfer_upload,
        status: data?.status,
      },
    };
  };

  getReportByDateStatus = async (
    start_date: Date,
    end_date: Date,
    status: StatusPengiriman,
  ) => {
    const startDate = new Date(start_date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end_date);
    endDate.setHours(23, 59, 59, 999);

    const data = await this.repo.getReportByDateStatus(
      startDate,
      endDate,
      status,
    );
    const totalQty = data.reduce((total, trx) => {
      return (
        total +
        trx.transaksiDetail.reduce((subtotal, detail) => {
          return subtotal + detail.qty;
        }, 0)
      );
    }, 0);

    const totalBayar = data.reduce((total, trx) => {
      return total + trx.total_bayar;
    }, 0);
    const transactions = data.map((trx) => {
      return {
        invoiceNumber: trx.no_trx,
        date: trx.tanggal_trx.toISOString(),
        customerName: trx.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: trx.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        totalProduct: trx.transaksiDetail.length,
        total: trx.total_bayar,
        transferEvidence: getStorageUrl(trx.transfer_upload),
        status: trx.status,
      };
    });

    return { transactions, totalBayar, totalQty, startDate, endDate };
  };

  getTransactionPengirimanByStatus = async (status: StatusPengiriman) => {
    const data = await this.repo.getTransactionPengiriman(status);
    const transactions = data.map((transaction) => ({
      invoiceNumber: transaction.no_trx,
      customerName: transaction.pelanggan.nama,
      date: transaction.tanggal_trx.toISOString(),
      distance: transaction.jarak_km,
    }));

    return { transactions };
  };

  readyToDeliver = async (no_trx: string, pengiriman_id: number) => {
    const transaction = await this.repo.findByNoTrx(no_trx);
    if (!transaction?.pelanggan) {
      throw new Error("Pelanggan tidak ditemukan");
    }

    const pelanggan = transaction.pelanggan;
    let estimasiMenit = 0;

    if (pelanggan.latitude && pelanggan.longitude) {
      const latitudeGudang = -6.3921;
      const longitudeGudang = 106.7461;

      const kalkulasiJarak = await hitungJarak(
        latitudeGudang,
        longitudeGudang,
        pelanggan.latitude,
        pelanggan.longitude,
      );

      estimasiMenit = kalkulasiJarak.estimasiMenit;
    }

    const status: StatusPengiriman = StatusPengiriman.DIKIRIM;
    const waktu_berangkat = new Date();
    const data = await this.repo.updatePengiriman(
      no_trx,
      status,
      pengiriman_id,
      estimasiMenit,
      waktu_berangkat,
    );

    return {
      transaction: {
        invoiceNumber: data?.no_trx,
        date: data?.tanggal_trx.toISOString(),
        customerName: data?.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: data?.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        total: data?.total_bayar,
        transferEvidence: getStorageUrl(data?.transfer_upload),
        status: data?.status,
        customerAddress:
          data?.pelanggan.alamat || "Alamat Pelanggan Tidak diketahui",
        customerMapLink: `https://maps.google.com?q=${data?.pelanggan.latitude},${data?.pelanggan.longitude}`,
      },
    };
  };

  finishingOrder = async (no_trx: string) => {
    const status: StatusPengiriman = StatusPengiriman.DITERIMA;
    const waktu_tiba_aktual = new Date();
    const data = await this.repo.updateSelesaiOrder(
      no_trx,
      status,
      waktu_tiba_aktual,
    );

    return {
      transaction: {
        invoiceNumber: data?.no_trx,
        date: data?.tanggal_trx.toISOString(),
        customerName: data?.pelanggan.nama || "Pelanggan Tidak diketahui",
        products: data?.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
        total: data?.total_bayar,
        transferEvidence: getStorageUrl(data?.transfer_upload),
        status: data?.status,
        customerAddress:
          data?.pelanggan.alamat || "Alamat Pelanggan Tidak diketahui",
        customerMapLink: `https://maps.google.com?q=${data?.pelanggan.latitude},${data?.pelanggan.longitude}`,
      },
    };
  };

  getTransactionByPelanggan = async (pelanggan_id: number) => {
    const data = await this.repo.getTransactionByPelanggan(pelanggan_id);

    const transactions = data.map((transaction) => {
      const estimasi =
        transaction.waktu_berangkat && transaction.estimasi_waktu
          ? hitungEstimasiTiba(
              transaction.waktu_berangkat,
              transaction.estimasi_waktu,
            )
          : {
              tanggalEstimasi: null,
              waktuEstimasi: null,
            };

      return {
        status: transaction.status,
        estimationDate: estimasi.tanggalEstimasi,
        estimationTime: estimasi.waktuEstimasi,
        products: transaction.transaksiDetail.map((detail) => ({
          name: detail.produk.nama,
          image: getStorageUrl(detail.produk.gambar),
          qty: detail.qty,
          price: detail.harga_satuan,
        })),
      };
    });

    return { transactions };
  };
}
