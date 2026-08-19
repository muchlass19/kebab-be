import { prisma } from "../lib/prisma.ts";

export class PelangganRepository {
  register = (nama: string, username: string, password: string) => {
    return prisma.pelanggan.create({
      data: {
        nama,
        username,
        password,
        alamat: "",
        no_hp: "",
      },
    });
  };

  findById = (id: number) => {
    return prisma.pelanggan.findFirst({
      where: {
        id,
      },
    });
  };

  updateProfile = (
    id: number,
    nama: string,
    username: string,
    alamat: string,
    no_hp: string,
    latitude: number,
    longitude: number
  ) => {
    return prisma.pelanggan.update({
      where: { id },
      data: {
        nama,
        username,
        alamat,
        no_hp,
        latitude,
        longitude
      },
    });
  };

  changePassword = (id: number, password: string) => {
    return prisma.pelanggan.update({
      where: { id },
      data: { password },
    });
  };

  findByUsername = (username: string) => {
    return prisma.pelanggan.findUnique({
      where: { username },
    });
  };
}
