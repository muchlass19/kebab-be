import { KaryawanRepository } from "../repositories/karyawan.repository";
import { hashPassword } from "../utils/password";

export interface EmployeeData {
  id: number;
  name: string;
  role: string;
  username: string;
}

export class KaryawanService {
  private repo = new KaryawanRepository();

  getAll = async () => {
    const data = await this.repo.getAll();
    const employees: EmployeeData[] = data.map((employee) => ({
      id: employee.id,
      name: employee.nama,
      role: employee.divisi.nama,
      username: employee.username,
    }));

    return { employees };
  };

  create = async (
    nama: string,
    username: string,
    password: string,
    password_confirm: string,
    divisi_id: number,
  ) => {
    if (!nama || !username || !password || !password_confirm || !divisi_id) {
      throw new Error("Semua field wajib diisi");
    }

    if (password !== password_confirm) {
      throw new Error("Password dan Konfirmasi Password harus sama!");
    }

    const existingKaryawan = await this.repo.findByUsername(username);
    if (existingKaryawan) {
      throw new Error("Username sudah terdaftar");
    }

    const hashedPassword = await hashPassword(password);

    const karyawan = await this.repo.create(
      nama,
      username,
      hashedPassword,
      divisi_id,
    );

    return {
      employee: {
        id: karyawan.id,
        name: karyawan.nama,
        role: karyawan.divisi.nama,
        username: karyawan.username,
      },
    };
  };

  update = async (
    id: number,
    nama: string,
    username: string,
    divisi_id: number,
  ) => {
    if (!nama || !username || !divisi_id) {
      throw new Error("Semua field harus diisi!");
    }

    const karyawan = await this.repo.update(id, nama, username, divisi_id);
    return { karyawan };
  };

  delete = async (id: number) => {
    return await this.repo.delete(id);
  };

  findById = async (id: number) => {
    const karyawan = await this.repo.findById(id);
    return {
      employee: {
        name: karyawan?.nama,
        role: karyawan?.divisi_id,
        id: karyawan?.id,
        username: karyawan?.username,
      },
    };
  };

  changePassword = async (
    id: number,
    password: string,
    password_confirm: string,
  ) => {
    if (!password || !password_confirm) {
      throw new Error("Password harus diisi!");
    }

    if (password !== password_confirm) {
      throw new Error("Password dan Konfirmasi Password harus sama!");
    }

    const hashedPassword = await hashPassword(password);

    const karyawan = await this.repo.changePassword(id, hashedPassword);
    return { karyawan };
  };
}
