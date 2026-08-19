-- CreateTable
CREATE TABLE `Divisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Karyawan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `divisi_id` INTEGER NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Karyawan_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelanggan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `alamat` TEXT NOT NULL,
    `no_hp` VARCHAR(15) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pelanggan_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stok` INTEGER NOT NULL,
    `gambar` TEXT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keranjang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pelanggan_id` INTEGER NOT NULL,
    `produk_id` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `no_trx` VARCHAR(30) NOT NULL,
    `tanggal_trx` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('MENUNGGU_VERIFIKASI', 'DIPROSES', 'DIKIRIM', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    `pelanggan_id` INTEGER NOT NULL,
    `transfer_upload` TEXT NULL,
    `status_bayar` BOOLEAN NOT NULL DEFAULT false,
    `total_bayar` DOUBLE NOT NULL,
    `pengiriman_id` INTEGER NULL,
    `jarak_km` DOUBLE NULL,
    `waktu_berangkat` DATETIME(3) NULL,
    `waktu_tiba_aktual` DATETIME(3) NULL,
    `estimasi_waktu` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`no_trx`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_trx` VARCHAR(30) NOT NULL,
    `produk_id` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `harga_satuan` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keranjang` ADD CONSTRAINT `Keranjang_pelanggan_id_fkey` FOREIGN KEY (`pelanggan_id`) REFERENCES `Pelanggan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keranjang` ADD CONSTRAINT `Keranjang_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `Produk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_pelanggan_id_fkey` FOREIGN KEY (`pelanggan_id`) REFERENCES `Pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_pengiriman_id_fkey` FOREIGN KEY (`pengiriman_id`) REFERENCES `Karyawan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_detail` ADD CONSTRAINT `transaksi_detail_no_trx_fkey` FOREIGN KEY (`no_trx`) REFERENCES `Transaksi`(`no_trx`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi_detail` ADD CONSTRAINT `transaksi_detail_produk_id_fkey` FOREIGN KEY (`produk_id`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
