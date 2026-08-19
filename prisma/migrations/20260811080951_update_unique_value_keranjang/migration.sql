/*
  Warnings:

  - A unique constraint covering the columns `[pelanggan_id,produk_id]` on the table `Keranjang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Keranjang_pelanggan_id_produk_id_key` ON `Keranjang`(`pelanggan_id`, `produk_id`);
