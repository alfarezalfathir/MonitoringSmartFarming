import { FileText, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import {
  getGlobalStatusClass,
  getRecommendation,
} from "../utils/farmUtils";

function ReportPage({ sensors, summary }) {
  const normalCount = sensors.filter(
    (item) => getGlobalStatusClass(item) === "normal"
  ).length;

  const warningCount = sensors.filter(
    (item) => getGlobalStatusClass(item) === "warning"
  ).length;

  const criticalCount = sensors.filter(
    (item) => getGlobalStatusClass(item) === "critical"
  ).length;

  const conclusion =
    criticalCount > 0
      ? "Beberapa petak lahan membutuhkan perhatian karena terdapat area kritis."
      : warningCount > 0
      ? "Sebagian lahan berada pada kondisi waspada dan perlu dipantau."
      : "Seluruh lahan berada pada kondisi normal.";

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Monitoring Report</h1>
          <p>
            Halaman ini menampilkan ringkasan laporan monitoring Smart Farming
            berdasarkan data dummy sensor IoT dari Supabase.
          </p>
        </div>

        <FileText size={42} />
      </section>

      {summary && (
        <section className="report-grid">
          <div className="report-card">
            <p>Total Petak</p>
            <h2>{summary.totalPetak}</h2>
          </div>

          <div className="report-card">
            <p>Rata-rata Kelembaban</p>
            <h2>{summary.avgSoilMoisture}%</h2>
          </div>

          <div className="report-card">
            <p>Suhu Tertinggi</p>
            <h2>{summary.maxTemperature}°C</h2>
          </div>

          <div className="report-card">
            <p>Pompa Aktif</p>
            <h2>{summary.activePump}</h2>
          </div>
        </section>
      )}

      <section className="report-layout">
        <div className="panel">
          <div className="panel-title">
            <h3>Ringkasan Status Lahan</h3>
            <span>Normal, waspada, dan kritis</span>
          </div>

          <div className="status-summary">
            <div className="status-box normal">
              <CheckCircle size={24} />
              <div>
                <strong>{normalCount} Petak</strong>
                <p>Normal</p>
              </div>
            </div>

            <div className="status-box warning">
              <AlertTriangle size={24} />
              <div>
                <strong>{warningCount} Petak</strong>
                <p>Waspada</p>
              </div>
            </div>

            <div className="status-box critical">
              <XCircle size={24} />
              <div>
                <strong>{criticalCount} Petak</strong>
                <p>Kritis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="panel conclusion-panel">
          <div className="panel-title">
            <h3>Kesimpulan Sistem</h3>
            <span>Hasil analisis sederhana</span>
          </div>

          <p>{conclusion}</p>

          <div className="report-note">
            Data yang digunakan merupakan data dummy sensor IoT yang disimpan di
            Supabase dan ditampilkan melalui dashboard localhost.
          </div>

          <button className="pump-btn wide">Download Report</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h3>Rekomendasi Per Petak</h3>
          <span>Berdasarkan kelembaban, suhu, dan cahaya</span>
        </div>

        <div className="recommendation-list">
          {sensors.map((item) => (
            <div
              className={`recommendation-item ${getGlobalStatusClass(item)}`}
              key={item.id}
            >
              <div className="recommendation-icon">
                {getGlobalStatusClass(item) === "normal" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
              </div>

              <div>
                <strong>{item.area}</strong>
                <p>{getRecommendation(item)}</p>
              </div>
            </div>
          ))}

          {sensors.length === 0 && <p>Data sensor belum tersedia.</p>}
        </div>
      </section>
    </div>
  );
}

export default ReportPage;