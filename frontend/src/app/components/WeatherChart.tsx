import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WeatherChartProps {
  marineData?: any[]; 
  waktuSaatIni?: string; // Tetap dipertahankan di interface agar tidak error jika Parent mengirimkannya
}

const defaultData = [
  { hari: 'Sen 10:00', tinggiGelombang: 0.12, kecepatanAngin: 1.2, suhuLaut: 30.0 },
  { hari: 'Sen 11:00', tinggiGelombang: 0.14, kecepatanAngin: 1.4, suhuLaut: 30.2 },
  { hari: 'Sen 12:00', tinggiGelombang: 0.15, kecepatanAngin: 1.5, suhuLaut: 30.5 },
  { hari: 'Sen 13:00', tinggiGelombang: 0.18, kecepatanAngin: 1.8, suhuLaut: 30.8 },
  { hari: 'Sen 14:00', tinggiGelombang: 0.22, kecepatanAngin: 2.1, suhuLaut: 31.0 },
];

export default function WeatherChart({ marineData = [] }: WeatherChartProps) {
  
  const formattedChartData = marineData.length > 0 
    ? marineData.map((item) => {
        // 1. Ambil string waktu dari database (mengakomodasi berbagai kemungkinan nama field)
        let timeString = item.time || item.time_prediction || item.prediction_time;
        
        // 2. Tambahkan 'Z' agar dibaca sebagai UTC, lalu biarkan browser mengubahnya ke WIB
        if (typeof timeString === 'string' && !timeString.endsWith('Z')) {
            timeString += 'Z';
        }

        const dateObj = new Date(timeString);
        const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
        const jam = dateObj.getHours().toString().padStart(2, '0') + ':00';

        // 3. Deteksi apakah ini data prediksi (mengecek nama field dari backend)
        const isPrediction = Object.keys(item).some(key => key.includes('pred'));

        return {
          hari: `${namaHari} ${jam}`,
          isPrediction: isPrediction,
          // Gunakan nilai prediksi jika ada, jika tidak gunakan nilai observasi
          tinggiGelombang: item.wave_height_pred ?? item.wave_height?.value ?? item.wave_height ?? 0,
          kecepatanAngin: item.wind_speed_pred ?? item.wind_speed_10m?.value ?? item.wind_speed_10m ?? 0, 
          suhuLaut: item.sea_surface_temperature_pred ?? item.sea_surface_temperature?.value ?? item.sea_surface_temperature ?? 0,
        };
      })
    : defaultData; 

  // 4. Menentukan posisi garis merah secara dinamis dari dalam data
  let referencePosition = "";

  if (formattedChartData.length > 1) {
    // Cari urutan ke berapa data prediksi itu dimulai
    const predIndex = formattedChartData.findIndex(item => item.isPrediction);
    
    if (predIndex > 0) {
      // Jika ketemu data prediksi, letakkan garis tepat di 1 jam sebelumnya (data observasi terakhir)
      referencePosition = formattedChartData[predIndex - 1].hari;
    } else if (predIndex === -1 && marineData.length > 0) {
      // Jika tidak ada data prediksi sama sekali di array, tidak usah beri garis
      referencePosition = "";
    } else {
      // Fallback cadangan
      referencePosition = formattedChartData[formattedChartData.length - 2].hari;
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Grafik Prediksi Keselamatan Maritim</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="hari"
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 500 }} iconType="line" />
          
          {referencePosition && (
            <ReferenceLine 
              x={referencePosition} 
              stroke="#EF4444" 
              strokeDasharray="5 5" 
              label={{ 
                position: 'top', 
                value: 'Batas Prediksi', 
                fill: '#EF4444', 
                fontSize: 12,
                fontWeight: 'bold'
              }} 
            />
          )}
          
          <Line
            type="monotone"
            dataKey="tinggiGelombang"
            stroke="#088395"
            strokeWidth={3}
            name="Tinggi Gelombang (m)"
            dot={{ fill: '#088395', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="kecepatanAngin"
            stroke="#05BFDB"
            strokeWidth={3}
            name="Kecepatan Angin (m/s)"
            dot={{ fill: '#05BFDB', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="suhuLaut"
            stroke="#FF6B6B"
            strokeWidth={3}
            name="Suhu Laut (°C)"
            dot={{ fill: '#FF6B6B', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
