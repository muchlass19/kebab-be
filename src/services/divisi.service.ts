import { DivisiRepository } from "../repositories/divisi.repository.ts";

export interface DivisiDropdown {
  label: string;
  value: number;
}

export interface DivisionData {
  id: number;
  name: string;
}
export class DivisiService {
  private repo = new DivisiRepository();

  getAll = async () => {
    const data = await this.repo.getAll();
    const divisions: DivisionData[] = data.map((division) => ({
      id: division.id,
      name: division.nama,
    }));

    return { divisions };
  };

  create = async (nama: string) => {
    if (!nama) {
      throw new Error("Nama divisi tidak boleh kosong!");
    }

    const divisiExists = await this.repo.findByName(nama);
    if (divisiExists) {
      throw new Error("Nama divisi sudah terdaftar!");
    }

    const divisis = await this.repo.create(nama);

    return { divisis };
  };

  update = async (id: number, nama: string) => {
    if (!nama) {
      throw new Error("Nama divisi tidak boleh kosong!");
    }

    const divisi = await this.repo.update(id, nama);

    return { divisi };
  };

  delete = async (id: number) => {
    return await this.repo.delete(id);
  };

  findById = async (id: number) => {
    const divisi = await this.repo.findById(id);

    return {
      division: {
        id: divisi?.id,
        name: divisi?.nama,
      },
    };
  };

  getForDropdown = async () => {
    const data = await this.repo.getAll();
    const list: DivisiDropdown[] = data.map((division) => ({
      label: division.nama,
      value: division.id,
    }));

    return { list };
  };
}
