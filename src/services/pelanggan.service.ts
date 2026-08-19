import { PelangganRepository } from "../repositories/pelanggan.repository.ts";
import { hashPassword } from "../utils/password";

export class PelangganService {
  private repo = new PelangganRepository();

  findById = async (id: number) => {
    if (!id) {
      throw new Error("ID Pelanggan tidak boleh kosong!");
    }

    const data = await this.repo.findById(id);
    return {
      customer: {
        id: data?.id,
        name: data?.nama,
        username: data?.username,
        address: data?.alamat,
        phoneNumber: data?.no_hp,
        lat: data?.latitude,
        long: data?.longitude,
      },
    };
  };

  updateProfile = async (
    id: number,
    nama: string,
    username: string,
    alamat: string,
    no_hp: string,
    latitude: number,
    longitude: number
  ) => {
    if (!nama || !username) {
      throw new Error("Nama dan Username tidak boleh kosong!");
    }

    const pelanggan = await this.repo.updateProfile(
      id,
      nama,
      username,
      alamat,
      no_hp,
      latitude,
      longitude
    );
    return { pelanggan };
  };

  changePassword = async (
    id: number,
    password: string,
    password_confirm: string,
  ) => {
    if (!password || !password_confirm) {
      throw new Error("Password dan Konfirmasi Password wajib diisi!");
    }

    if (password !== password_confirm) {
      throw new Error("Password dan Konfirmasi Password harus sama");
    }

    const hashedPassword = await hashPassword(password);
    const pelanggan = await this.repo.changePassword(id, hashedPassword);

    return { pelanggan };
  };
}
