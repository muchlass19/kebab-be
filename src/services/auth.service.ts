import { signToken } from "../utils/jwt";
import { KaryawanRepository } from "../repositories/karyawan.repository";
import { comparePassword, hashPassword } from "../utils/password";
import { PelangganRepository } from "../repositories/pelanggan.repository";

export class AuthService {
  private repoKaryawan = new KaryawanRepository();
  private repoPelanggan = new PelangganRepository();

  login = async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error("Username dan Password wajib diisi!");
    }

    const karyawan = await this.repoKaryawan.findByUsername(username);

    if (karyawan) {
      const isPasswordValid = await comparePassword(
        password,
        karyawan.password,
      );
      if (!isPasswordValid) {
        throw new Error("Username atau password salah!");
      }

      const token = signToken(karyawan.id, karyawan.divisi.nama);

      return {
        user: {
          id: karyawan.id,
          nama: karyawan.nama,
          username: karyawan.username,
          role: karyawan.divisi.nama,
        },
        token,
      };
    }

    const pelanggan = await this.repoPelanggan.findByUsername(username);

    if (pelanggan) {
      const isPasswordValid = await comparePassword(
        password,
        pelanggan.password,
      );
      if (!isPasswordValid) {
        throw new Error("Username atau password salah!");
      }

      const token = signToken(pelanggan.id, "Pelanggan");

      return {
        user: {
          id: pelanggan.id,
          nama: pelanggan.nama,
          username: pelanggan.username,
          role: "Pelanggan",
        },
        token,
      };
    }

    throw new Error("Username atau password salah!");
  };

  register = async (
    nama: string,
    username: string,
    password: string,
    password_confirm: string,
  ) => {
    if (!nama || !username || !password || !password_confirm) {
      throw new Error("Semua field wajib diisi");
    }

    if (password !== password_confirm) {
      throw new Error("Password dan Konfirmasi Password harus sama");
    }

    const existingPelanggan = await this.repoPelanggan.findByUsername(username);
    if (existingPelanggan) {
      throw new Error("Username sudah terdaftar");
    }

    const hashedPassword = await hashPassword(password);
    const pelanggan = await this.repoPelanggan.register(
      nama,
      username,
      hashedPassword,
    );

    return {
      user: {
        id: pelanggan.id,
        nama: pelanggan.nama,
        username: pelanggan.username,
        role: "Pelanggan",
      },
    };
  };
}
