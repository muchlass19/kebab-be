import { prisma } from "../lib/prisma.ts";

export class KaryawanRepository {
  getAll = () => {
    return prisma.karyawan.findMany({
      where: {
        divisi: {
          nama: {
            notIn: ["Owner", "owner"],
          },
        },
      },
      include: {
        divisi: true,
      },
    });
  };

  create = (
    nama: string,
    username: string,
    password: string,
    divisi_id: number,
  ) => {
    return prisma.karyawan.create({
      data: {
        nama,
        username,
        password,
        divisi_id,
      },
      include: {
        divisi: true,
      },
    });
  };

  update = (id: number, nama: string, username: string, divisi_id: number) => {
    return prisma.karyawan.update({
      where: { id },
      data: {
        nama,
        username,
        divisi_id,
      },
      include: {
        divisi: true,
      },
    });
  };

  delete = (id: number) => {
    return prisma.karyawan.delete({
      where: { id },
    });
  };

  findById = (id: number) => {
    return prisma.karyawan.findFirst({
      where: { id },
      include: { divisi: true },
    });
  };

  findByUsername = (username: string) => {
    return prisma.karyawan.findUnique({
      where: { username },
      include: { divisi: true },
    });
  };

  changePassword = (id: number, password: string) => {
    return prisma.karyawan.update({
      where: { id },
      data: {
        password,
      },
    });
  };
}
