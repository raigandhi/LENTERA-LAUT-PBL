import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WeatherChartProps {
  marineData?: any[]; 
  waktuSaatIni?: string; 
}

const defaultData = [
  { hari: 'Sen 10:00', tinggiGelombang: 0.12, kecepatanAngin: 1.2, suhuLaut: 30.0 },
  { hari: 'Sen 11:00', tinggiGelombang: 0.14, kecepatanAngin: 1.4, suhuLaut: 30.2 },
  { hari: 'Sen 12:00', tinggiGelombang: 0.15, kecepatanAngin: 1.5, suhuLaut: 30.5 },
  { hari: 'Sen 13:00', tinggiGelombang: 0.18, kecepatanAngin: 1.8, suhuLaut: 30.8 },
  { hari: 'Sen 14:00', tinggiGelombang: 0.22, kecepatanAngin: 2.1, suhuLaut: 31.0 },
];

export default function WeatherChart({ marineData = [], waktuSaatIni }: WeatherChartProps) {
  
  const formattedChartData = marineData.length > 0 
    ? marineData.map((item) => {
        // Ambil string waktu dari database
        let timeString = item.time || item.time_prediction;
        
        // Tambahkan 'Z' agar dibaca sebagai UTC, lalu biarkan browser mengubahnya ke waktu lokal (WIB)
        if (typeof timeString === 'string' && !timeString.endsWith('Z')) {
            timeString += 'Z';
        }

        const dateObj = new Date(timeString);
        const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
        const jam = dateObj.getHours().toString().padStart(2, '0') + ':00';

        return {
          hari: `${namaHari} ${jam}`,
          tinggiGelombang: item.wave_height?.value || item.wave_height || 0,
          kecepatanAngin: item.wind_speed_10m?.value || item.wind_speed_10m || 0, 
          suhuLaut: item.sea_surface_temperature?.value || item.sea_surface_temperature || 0,
        };
      })
    : defaultData; 

  // Men-generate 'waktuSaatIni' secara otomatis jika tidak dilempar dari komponen induk
  const currentLocalTime = waktuSaatIni || (() => {
    const now = new Date();
    const namaHariSekarang = now.toLocaleDateString('id-ID', { weekday: 'short' });
    const jamSekarang = now.getHours().toString().padStart(2, '0') + ':00';
    return `${namaHariSekarang} ${jamSekarang}`;
  })();

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
          
          {currentLocalTime && (
            <ReferenceLine 
              x={currentLocalTime} 
              stroke="#EF4444" 
              strokeDasharray="5 5" 
              label={{ 
                position: 'top', 
                value: 'Jam Saat Ini', 
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
