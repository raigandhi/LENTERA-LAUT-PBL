// src/app/services/api.ts

// Tambahkan BASE_URL ini di bagian paling atas
const BASE_URL = "https://raigandhi-pbl-lentera-laut.hf.space";

export async function fetchPrediction(locationName: string) {
  // Ganti http://127.0.0.1:8000 dengan BASE_URL
  const url = `${BASE_URL}/predict?location=${locationName}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error pada API:", error);
    throw error;
  }
}

export async function fetchLocations() {
  // Ganti http://127.0.0.1:8000 dengan BASE_URL
  const url = `${BASE_URL}/locations`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data lokasi. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Mengembalikan array of objects lokasi
  } catch (error) {
    console.error("Error pada API Locations:", error);
    return []; // Kembalikan array kosong jika gagal agar map tidak crash
  }
}

export async function fetchHistory(locationName: string, limit: number = 5) {
  // Ganti http://127.0.0.1:8000 dengan BASE_URL
  const url = `${BASE_URL}/marine-weather?location=${locationName}&limit=${limit}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data history. Status: ${response.status}`);
    }

    const data = await response.json();
    // Karena API aslimu sepertinya mengembalikan array langsung (berdasarkan Swagger), 
    // kita bungkus ke dalam object { history: data } agar cocok dengan App.tsx
    return { history: data }; 
  } catch (error) {
    console.error("Error pada API History:", error);
    // Kembalikan struktur default jika gagal agar aplikasi tidak crash
    return { history: [] }; 
  }
}
