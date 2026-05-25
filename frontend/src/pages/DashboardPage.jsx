import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Sprout,
  Thermometer,
  Droplets,
  Power,
  AlertTriangle,
  RefreshCw,
  Activity,
  Database,
  CheckCircle,
  Cpu,
} from "lucide-react";

import Farm3DModel from "../components/Farm3DModel";
import SensorTable from "../components/SensorTable";
import {
  getGlobalStatusClass,
  getGlobalStatusLabel,
  getRecommendation,
} from "../utils/farmUtils";

const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444"];

function DashboardPage({ sensors, summary, lastUpdate, fetchData, togglePump }) {
  const statusData = [
    {
      name: "Normal",
      value: sensors.filter((item) => getGlobalStatusClass(item) === "normal")
        .length,
    },
    {
      name: "Waspada",
      value: sensors.filter((item) => getGlobalStatusClass(item) === "warning")
        .length,
    },
    {
      name: "Kritis",
      value: sensors.filter((item) => getGlobalStatusClass(item) === "critical")
        .length,
    },
  ];

  const criticalSensors = sensors.filter(
    (item) => getGlobalStatusClass(item) === "critical"
  );

  return (
    <div className="dashboard">
      <section className="hero">
        <div>
          <div className="hero-label">
            <Sprout size={18} />
            Smart Farming IoT Dashboard
          </div>

          <h1>Monitoring Lahan Pertanian</h1>

          <p>
            Dashboard ini menampilkan data dummy sensor IoT dari Supabase,
            diproses melalui backend Express, dan divisualisasikan di frontend
            React Vite.
          </p>

          <div className="hero-info">
            <span>Backend: Node.js Express</span>
            <span>Database: Supabase</span>
            <span>Frontend: React Vite</span>
          </div>
        </div>

        <div className="live-box">
          <Activity size={28} />
          <h3>Localhost Active</h3>
          <p>Last update: {lastUpdate || "-"}</p>

          <button onClick={fetchData}>
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </section>

      {summary && (
        <section className="summary-grid">
          <div className="summary-card">
            <div className="icon-box green">
              <Sprout size={24} />
            </div>
            <p>Total Petak</p>
            <h2>{summary.totalPetak}</h2>
          </div>

          <div className="summary-card">
            <div className="icon-box blue">
              <Droplets size={24} />
            </div>
            <p>Rata-rata Tanah</p>
            <h2>{summary.avgSoilMoisture}%</h2>
          </div>

          <div className="summary-card">
            <div className="icon-box orange">
              <Thermometer size={24} />
            </div>
            <p>Suhu Tertinggi</p>
            <h2>{summary.maxTemperature}°C</h2>
          </div>

          <div className="summary-card">
            <div className="icon-box purple">
              <Power size={24} />
            </div>
            <p>Pompa Aktif</p>
            <h2>{summary.activePump}</h2>
          </div>

          <div className="summary-card danger-card">
            <div className="icon-box red">
              <AlertTriangle size={24} />
            </div>
            <p>Area Kritis</p>
            <h2>{summary.criticalArea}</h2>
          </div>
        </section>
      )}

      <section className="main-grid">
        <div className="panel land-panel">
          <div className="panel-title">
            <h3>Denah Visual Petak Lahan 3D</h3>
            <span>Drag untuk putar, scroll untuk zoom, klik petak untuk detail</span>
          </div>

          <Farm3DModel sensors={sensors} />
        </div>

        <div className="panel alert-panel">
          <div className="panel-title">
            <h3>Alert Kondisi Lahan</h3>
            <span>Area yang perlu diperhatikan</span>
          </div>

          {criticalSensors.length === 0 ? (
            <div className="safe-alert">Semua petak dalam kondisi aman.</div>
          ) : (
            <div className="alert-list">
              {criticalSensors.map((item) => (
                <div className="alert-item" key={item.id}>
                  <AlertTriangle size={18} />
                  <div>
                    <strong>{item.area} perlu diperhatikan</strong>
                    <p>
                      Kelembaban tanah {item.soil_moisture}% dan suhu{" "}
                      {item.temperature}°C.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="status-chart premium-status-chart">
          <div className="status-chart-left">
            <div className="status-chart-head">
              <div>
                <h4>Distribusi Status Lahan</h4>
                <p>Ringkasan kondisi seluruh petak</p>
              </div>
              <span>{sensors.length} Petak</span>
            </div>

            <div className="status-legend">
              {statusData.map((item) => (
                <div className={`legend-item ${item.name.toLowerCase()}`} key={item.name}>
                  <span></span>
                  <div>
                    <strong>{item.value}</strong>
                    <p>{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pie-layout">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <defs>
                  <linearGradient id="normalGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#86efac" />
                  </linearGradient>
                  <linearGradient id="warningGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                  <linearGradient id="criticalGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#fca5a5" />
                  </linearGradient>
                </defs>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={7}
                  cornerRadius={14}
                  stroke="none"
                >
                  <Cell fill="url(#normalGradient)" />
                  <Cell fill="url(#warningGradient)" />
                  <Cell fill="url(#criticalGradient)" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #dcfce7",
                    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pie-center-info">
              <strong>{sensors.length}</strong>
              <span>Total Petak</span>
            </div>
          </div>
        </div>
      </section>

      <section className="insight-grid">
        <div className="panel recommendation-panel">
          <div className="panel-title">
            <h3>Rekomendasi Sistem</h3>
            <span>Decision support berdasarkan data sensor</span>
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
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-title">
            <h3>Activity Log</h3>
            <span>Simulasi aktivitas sistem</span>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <Cpu size={18} />
              <div>
                <strong>Backend aktif</strong>
                <p>Node.js Express berjalan pada localhost:5000.</p>
              </div>
            </div>

            <div className="activity-item">
              <Database size={18} />
              <div>
                <strong>Data diperbarui</strong>
                <p>Data sensor berhasil diambil dari Supabase.</p>
              </div>
            </div>

            <div className="activity-item">
              <RefreshCw size={18} />
              <div>
                <strong>Auto refresh aktif</strong>
                <p>Frontend melakukan pembaruan data setiap 60 detik.</p>
              </div>
            </div>

            <div className="activity-item">
              <Power size={18} />
              <div>
                <strong>Kontrol pompa tersedia</strong>
                <p>Status pompa dapat diubah melalui dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="chart-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>Grafik Kelembaban Tanah</h3>
            <span>Persentase kelembaban tiap petak</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="soil_moisture"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>Grafik Suhu Petak</h3>
            <span>Monitoring suhu tiap area</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sensors}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="temperature"
                fill="#16a34a"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <SensorTable
        sensors={sensors}
        togglePump={togglePump}
        getStatusClass={getGlobalStatusClass}
        getStatusLabel={getGlobalStatusLabel}
      />
    </div>
  );
}

export default DashboardPage;