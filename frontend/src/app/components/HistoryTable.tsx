import { Calendar, Waves, Wind, Thermometer, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface HistoryTableProps {
  historyData: any[];
  locationName?: string;
}

export default function HistoryTable({ historyData = [], locationName }: HistoryTableProps) {
  // Jika belum ada data yang dicari
  if (!historyData || historyData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Data Riwayat</h2>
        <p className="text-gray-500 max-w-md">Silakan pilih lokasi pelabuhan dan lakukan pencarian di Dasbor Utama terlebih dahulu.</p>
      </div>
    );
  }

  // Mengurutkan data dari yang paling baru ke paling lama untuk tabel
  const sortedData = [...historyData].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  // Fungsi pintar (DSS) untuk menentukan status bahaya berdasarkan tinggi gelombang
  const getStatus = (waveHeight: number) => {
    if (waveHeight < 1.25) return { text: 'Aman', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    if (waveHeight < 2.5) return { text: 'Waspada', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle };
    return { text: 'Bahaya', color: 'bg-red-100 text-red-700', icon: AlertTriangle };
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header Tabel */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tabel Riwayat Cuaca</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4 text-[#088395]" />
            <span>Lokasi: <strong className="text-gray-700">{locationName || 'Belum dipilih'}</strong></span>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
          Total: {sortedData.length} Data Terekam
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
              <th className="p-4 font-semibold whitespace-nowrap">Waktu Observasi</th>
              <th className="p-4 font-semibold whitespace-nowrap">Tinggi Gelombang</th>
              <th className="p-4 font-semibold whitespace-nowrap">Kecepatan Angin</th>
              <th className="p-4 font-semibold whitespace-nowrap">Suhu Laut</th>
              <th className="p-4 font-semibold whitespace-nowrap">Status Rekomendasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {sortedData.map((row, index) => {
              
              // Menerapkan trik 'Z' agar jam sinkron dengan Waktu Lokal (WIB)
              let timeString = row.time;
              if (typeof timeString === 'string' && !timeString.endsWith('Z')) {
                timeString += 'Z';
              }

              const dateObj = new Date(timeString);
              const formatWaktu = dateObj.toLocaleDateString('id-ID', { 
                weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
              }) + ' - ' + dateObj.getHours().toString().padStart(2, '0') + ':00 WIB';
              
              const gelombang = row.wave_height?.value || row.wave_height || 0;
              const angin = row.wind_speed_10m?.value || row.wind_speed_10m || 0;
              const suhu = row.sea_surface_temperature?.value || row.sea_surface_temperature || 0;
              const status = getStatus(gelombang);
              const StatusIcon = status.icon;

              return (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-gray-700 font-medium">{formatWaktu}</td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4 text-[#05BFDB]" />
                      <span className="font-semibold text-gray-900">{gelombang.toFixed(2)} m</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-[#37B7C3]" />
                      <span className="text-gray-700">{angin.toFixed(1)} m/s</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-[#FF6B6B]" />
                      <span className="text-gray-700">{suhu.toFixed(1)} °C</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
