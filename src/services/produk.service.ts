import { ProdukRepository } from "../repositories/produk.repository.ts";
import { getStorageUrl } from "../utils/storage";

export interface ProductData {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: number;
  image: string;
}

export class ProdukService {
  private repo = new ProdukRepository();

  getAll = async () => {
    const data = await this.repo.getAll();
    const products: ProductData[] = data.map((product) => ({
      id: product.id,
      name: product.nama,
      price: product.harga,
      stock: product.stok,
      status: Number(product.is_available),
      image: getStorageUrl(product.gambar) ?? "",
    }));
    return { products };
  };

  create = async (
    nama: string,
    harga: number,
    stok: number,
    gambar: string,
    is_available: boolean,
  ) => {
    if (!nama || !harga || !stok) {
      throw new Error("Nama, Harga, dan Stok wajib diisi");
    }

    const produk = await this.repo.create(
      nama,
      harga,
      stok,
      gambar,
      is_available,
    );
    return { produk };
  };

  update = async (
    id: number,
    nama: string,
    harga: number,
    stok: number,
    gambar: string,
    is_available: boolean,
  ) => {
    if (!nama || !harga || !stok) {
      throw new Error("Nama, Harga, dan Stok wajib diisi");
    }

    const produk = await this.repo.update(
      id,
      nama,
      harga,
      stok,
      gambar,
      is_available,
    );
    return { produk };
  };

  delete = async (id: number) => {
    return await this.repo.delete(id);
  };

  findById = async (id: number) => {
    const data = await this.repo.findById(id);
    return {
      product: {
        id: data?.id,
        name: data?.nama,
        price: data?.harga,
        stock: data?.stok,
        status: Number(data?.is_available),
        image: getStorageUrl(data?.gambar) ?? "",
      },
    };
  };

  findAllProducts = async () => {
    const data = await this.repo.getAll();
    const products = data.map((product) => ({
      id: product.id,
      name: product.nama,
      image: getStorageUrl(product.gambar),
      price: product.harga,
      qty: 0,
    }));

    return { products };
  };
}
