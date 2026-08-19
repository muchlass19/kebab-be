import { KeranjangRepository } from "../repositories/keranjang.repository.ts";
import { PelangganRepository } from "../repositories/pelanggan.repository.ts";
import { getStorageUrl } from "../utils/storage.ts";

export class KeranjangService {
  private repo = new KeranjangRepository();
  private pelangganRepo = new PelangganRepository();

  get = async (pelanggan_id: number) => {
    const keranjangs = await this.repo.get(pelanggan_id);
    const user = await this.pelangganRepo.findById(pelanggan_id);

    const userInfo = {
      id: user?.id,
      address: user?.alamat,
    };

    const products = keranjangs.map((keranjang: any) => {
      return {
        id: keranjang.produk.id,
        image: getStorageUrl(keranjang.produk.gambar),
        name: keranjang.produk.nama,
        price: keranjang.produk.harga,
        qty: keranjang.qty,
      };
    });
    return { user: userInfo, products };
  };

  add = async (pelanggan_id: number, produk_id: number, qty: number) => {
    if (!pelanggan_id) {
      throw new Error("Harus melakukan login terlebih dahulu");
    }

    if (!produk_id || !qty || qty === 0) {
      throw new Error("Produk harus ditambahkan");
    }

    const keranjang = await this.repo.add(pelanggan_id, produk_id, qty);
    return { keranjang };
  };

  updateQty = async (pelanggan_id: number, produk_id: number, qty: number) => {
    if (!qty || qty === 0) {
      throw new Error("Qty produk harus diisi");
    }

    const searchPelanggan = await this.repo.findByPelangganId(
      pelanggan_id,
      produk_id,
    );

    if (!searchPelanggan || searchPelanggan.length === 0) {
      const data = await this.repo.add(pelanggan_id, produk_id, qty);

      return {
        products: {
          id: data.produk.id,
          image: getStorageUrl(data.produk.gambar),
          name: data.produk.nama,
          price: data.produk.harga,
          qty: data.qty,
        },
      };
    }

    const data = await this.repo.updateQty(pelanggan_id, produk_id, qty);
    return {
      products: {
        id: data.produk.id,
        image: getStorageUrl(data.produk.gambar),
        name: data.produk.nama,
        price: data.produk.harga,
        qty: data.qty,
      },
    };
  };

  delete = async (id: number) => {
    return await this.repo.delete(id);
  };

  destroyCart = async (pelanggan_id: number) => {
    return await this.repo.destroyCart(pelanggan_id);
  };
}
