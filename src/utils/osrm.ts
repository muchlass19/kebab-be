export async function hitungJarak(
  latitudeGudang: number,
  longitudeGudang: number,
  latitudeTujuan: number,
  longitudeTujuan: number,
): Promise<{
  jarakKm: number;
  estimasiMenit: number;
}> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${longitudeGudang},${latitudeGudang};${longitudeTujuan},${latitudeTujuan}?overview=false`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      const route = data.routes[0];

      const jarakKm = route.distance / 1000;
      const estimasiMenit = route.duration / 60;

      return {
        jarakKm: parseFloat(jarakKm.toFixed(2)),
        estimasiMenit: Math.ceil(estimasiMenit),
      };
    }

    return {
      jarakKm: 0,
      estimasiMenit: 0,
    };
  } catch (error) {
    console.error("Gagal mengambil data jarak dari OSRM: ", error);
    return {
      jarakKm: 0,
      estimasiMenit: 0,
    };
  }
}

export function hitungEstimasiTiba(
  waktuBerangkat: Date,
  estimasiMenit: number,
): { tanggalEstimasi: string; waktuEstimasi: string } {
  const berangkat = new Date(waktuBerangkat);
  const estimasiTiba = new Date(
    berangkat.getTime() + estimasiMenit * 60 * 1000,
  );

  const tanggalEstimasi = estimasiTiba.toLocaleDateString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const waktuEstimasi = estimasiTiba.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  });

  return { tanggalEstimasi, waktuEstimasi };
}
