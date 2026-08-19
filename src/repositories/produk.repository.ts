import { prisma } from "../lib/prisma.ts";

export class ProdukRepository {
  getAll = () => {
    return prisma.produk.findMany({
      where: { deletedAt: null },
    });
  };

  create = (
    nama: string,
    harga: number,
    stok: number,
    gambar: string,
    is_available: boolean,
  ) => {
    return prisma.produk.create({
      data: {
        nama,
        harga,
        stok,
        gambar,
        is_available,
      },
    });
  };

  update = (
    id: number,
    nama: string,
    harga: number,
    stok: number,
    gambar: string,
    is_available: boolean,
  ) => {
    return prisma.produk.update({
      where: { id },
      data: {
        nama,
        harga,
        stok,
        gambar,
        is_available,
      },
    });
  };

  delete = (id: number) => {
    return prisma.produk.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  };

  findById = (id: number) => {
    return prisma.produk.findFirst({
      where: { id, deletedAt: null },
    });
  };
}
