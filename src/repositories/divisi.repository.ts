import { prisma } from "../lib/prisma";

export class DivisiRepository {
  getAll = () => {
    return prisma.divisi.findMany();
  };

  create = (nama: string) => {
    return prisma.divisi.create({
      data: {
        nama,
      },
    });
  };

  update = (id: number, nama: string) => {
    return prisma.divisi.update({
      where: { id: id },
      data: { nama: nama },
    });
  };

  delete = (id: number) => {
    return prisma.divisi.delete({
      where: { id },
    });
  };

  findById = (id: number) => {
    return prisma.divisi.findFirst({
      where: {
        id,
      },
    });
  };

  findByName = (nama: string) => {
    return prisma.divisi.findFirst({
      where: {
        nama,
      },
    });
  };
}
