import { prisma } from "../lib/prisma";

export class KeranjangRepository {
  get = (pelanggan_id: number) => {
    return prisma.keranjang.findMany({
      where: { pelanggan_id },
      include: { produk: true },
    });
  };

  add = (pelanggan_id: number, produk_id: number, qty: number) => {
    return prisma.keranjang.create({
      data: {
        pelanggan_id,
        produk_id,
        qty,
      },
      include: { produk: true },
    });
  };

  updateQty = (pelanggan_id: number, produk_id: number, qty: number) => {
    return prisma.keranjang.update({
      where: {
        pelanggan_id_produk_id: {
          pelanggan_id,
          produk_id,
        },
      },
      data: {
        qty,
      },
      include: { produk: true },
    });
  };

  delete = (id: number) => {
    return prisma.keranjang.delete({
      where: { id },
    });
  };

  destroyCart = (pelanggan_id: number) => {
    return prisma.keranjang.deleteMany({
      where: { pelanggan_id },
    });
  };

  findByPelangganId = (pelanggan_id: number, produk_id: number) => {
    return prisma.keranjang.findMany({
      where: { pelanggan_id, produk_id },
    });
  };
}
