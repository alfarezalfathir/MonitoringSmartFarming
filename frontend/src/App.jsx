import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
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
  Sun,
  Power,
  AlertTriangle,
  RefreshCw,
  Activity,
  Database,
  Settings,
  Info,
  Search,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  Cpu,
} from "lucide-react";
import Navbar from "./components/Navbar";
import "./App.css";
import Farm3D from "./components/Farm3D";

const API_URL = "http://localhost:5000";
const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444"];

function getGlobalStatusClass(item) {
  const soil = Number(item.soil_moisture);
  const temp = Number(item.temperature);

  if (soil < 25 || temp > 33) return "critical";
  if (soil < 40 || temp > 31) return "warning";
  return "normal";
}

function getGlobalStatusLabel(item) {
  const status = getGlobalStatusClass(item);

  if (status === "critical") return "Kritis";
  if (status === "warning") return "Waspada";
  return "Normal";
}

function getRecommendation(item) {
  const soil = Number(item.soil_moisture);
  const temp = Number(item.temperature);
  const light = Number(item.light);

  if (soil < 25) {
    return "Nyalakan pompa karena kelembaban tanah rendah.";
  }

  if (temp > 33) {
    return "Lakukan pengecekan karena suhu lahan terlalu tinggi.";
  }

  if (light > 850) {
    return "Intensitas cahaya tinggi, tanaman perlu dipantau.";
  }

  if (soil >= 25 && soil < 40) {
    return "Kondisi tanah mulai kering, siapkan penyiraman.";
  }

  return "Kondisi lahan normal.";
}

function HomePage() {
  return (
    <div className="page">
      <section className="home-hero">
        <div>
          <div className="hero-label">
            <Sprout size={18} />
            Smart Farming Monitoring System
          </div>

          <h1>Monitoring Lahan Pertanian Berbasis IoT Dummy</h1>

          <p>
            Sistem ini digunakan untuk memantau kondisi lahan pertanian melalui
            data dummy sensor IoT yang disimpan di Supabase, diproses oleh
            backend Node.js Express, dan ditampilkan menggunakan React Vite.
          </p>

          <div className="home-actions">
            <Link to="/dashboard" className="primary-link">
              Masuk Dashboard
            </Link>

            <Link to="/data-sensor" className="secondary-link">
              Lihat Data Sensor
            </Link>
          </div>
        </div>

        <div className="home-visual">
          <div className="circle-card big">
            <Sprout size={52} />
            <strong>Smart Farming</strong>
            <span>IoT Dashboard</span>
          </div>

          <div className="mini-card one">Soil Moisture</div>
          <div className="mini-card two">Pump Control</div>
          <div className="mini-card three">Supabase</div>
        </div>
      </section>

      <section className="home-showcase">
        <div className="showcase-left">
          <div className="showcase-badge">Live Visual Preview</div>

          <h2>Visualisasi Lahan Smart Farming</h2>

          <p>
            Dashboard ini menampilkan kondisi tiap petak lahan secara visual,
            termasuk status normal, waspada, kritis, serta simulasi monitoring
            sensor IoT.
          </p>

          <div className="showcase-stats">
            <div>
              <strong>3D</strong>
              <span>Denah Lahan</span>
            </div>

            <div>
              <strong>5s</strong>
              <span>Auto Refresh</span>
            </div>

            <div>
              <strong>IoT</strong>
              <span>Dummy Data</span>
            </div>
          </div>

          <Link to="/dashboard" className="showcase-btn">
            Buka Dashboard 3D
          </Link>
        </div>

        <FarmPreview />
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <Droplets size={28} />
          <h3>Monitoring Kelembaban</h3>
          <p>Menampilkan kelembaban tanah tiap petak lahan secara visual.</p>
        </div>

        <div className="feature-card">
          <Thermometer size={28} />
          <h3>Monitoring Suhu</h3>
          <p>Memantau suhu area lahan berdasarkan data sensor dummy.</p>
        </div>

        <div className="feature-card">
          <Power size={28} />
          <h3>Kontrol Pompa</h3>
          <p>Simulasi menyalakan dan mematikan pompa pada setiap petak.</p>
        </div>

        <div className="feature-card">
          <Database size={28} />
          <h3>Database Supabase</h3>
          <p>Data dummy sensor disimpan di database Supabase PostgreSQL.</p>
        </div>
      </section>
    </div>
  );
}

function FarmPreview({ sensors = [] }) {
  const fallback = [
    { id: 1, area: "Petak 1", status: "normal" },
    { id: 2, area: "Petak 2", status: "warning" },
    { id: 3, area: "Petak 3", status: "critical" },
    { id: 4, area: "Petak 4", status: "normal" },
    { id: 5, area: "Petak 5", status: "normal" },
    { id: 6, area: "Petak 6", status: "warning" },
  ];

  const data =
    sensors.length > 0
      ? sensors.slice(0, 6).map((item) => ({
          id: item.id,
          area: item.area,
          status: getGlobalStatusClass(item),
        }))
      : fallback;

  return (
    <div className="farm-preview">
      <div className="farm-row">
        {data.slice(0, 3).map((item) => (
          <div className={`farm-plot ${item.status}`} key={item.id}>
            <Sprout size={34} />
            <span>{item.area}</span>
            <small>{getLabelFromStatus(item.status)}</small>
          </div>
        ))}
      </div>

      <div className="farm-row second">
        {data.slice(3, 6).map((item, index) => (
          <div
            className={`farm-plot ${item.status} ${index !== 1 ? "tall" : ""}`}
            key={item.id}
          >
            <Sprout size={34} />
            <span>{item.area}</span>
            <small>{getLabelFromStatus(item.status)}</small>
          </div>
        ))}
      </div>

      <div className="preview-glow"></div>
    </div>
  );
}

function getLabelFromStatus(status) {
  if (status === "critical") return "Kritis";
  if (status === "warning") return "Waspada";
  return "Normal";
}

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
            <span>Drag putar · scroll zoom · klik petak untuk detail</span>
          </div>

          <Farm3D
            sensors={sensors}
            onSelectPetak={(sensor) => {
              console.log("Petak dipilih:", sensor);
            }}
          />
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

          <div className="status-chart">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
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
                <p>Frontend melakukan pembaruan data setiap 5 detik.</p>
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

function SensorTable({ sensors, togglePump, getStatusClass, getStatusLabel }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <h3>Data Sensor dan Kontrol Pompa</h3>
        <span>Data berasal dari database Supabase</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Petak</th>
              <th>Suhu</th>
              <th>Tanah</th>
              <th>Udara</th>
              <th>Cahaya</th>
              <th>Pompa</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {sensors.map((item) => (
              <tr key={item.id}>
                <td>{item.area}</td>
                <td>{item.temperature}°C</td>
                <td>{item.soil_moisture}%</td>
                <td>{item.humidity}%</td>
                <td>{item.light} lux</td>
                <td>
                  <span
                    className={
                      item.pump_status === "ON" ? "pump on" : "pump off"
                    }
                  >
                    {item.pump_status}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${getStatusClass(item)}`}>
                    {getStatusLabel(item)}
                  </span>
                </td>
                <td>
                  <button
                    className="pump-btn"
                    onClick={() => togglePump(item.id, item.pump_status)}
                  >
                    {item.pump_status === "ON" ? "Matikan" : "Nyalakan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataSensorPage({ sensors, togglePump }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = sensors.filter((item) => {
    const matchSearch = item.area.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Semua" || getGlobalStatusLabel(item) === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Data Sensor</h1>
          <p>
            Halaman ini menampilkan data sensor dari Supabase secara lebih detail
            dengan fitur pencarian dan filter status.
          </p>
        </div>

        <Database size={42} />
      </section>

      <section className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari petak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>Semua</option>
            <option>Normal</option>
            <option>Waspada</option>
            <option>Kritis</option>
          </select>
        </div>

        <SensorTable
          sensors={filtered}
          togglePump={togglePump}
          getStatusClass={getGlobalStatusClass}
          getStatusLabel={getGlobalStatusLabel}
        />
      </section>
    </div>
  );
}

function ControlPanelPage({ sensors, togglePump }) {
  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Control Panel Pompa</h1>
          <p>
            Halaman ini digunakan untuk simulasi kontrol pompa pada setiap petak
            lahan.
          </p>
        </div>

        <Settings size={42} />
      </section>

      <section className="control-grid">
        {sensors.map((item) => (
          <div className="control-card" key={item.id}>
            <div>
              <h3>{item.area}</h3>
              <p>Kelembaban tanah: {item.soil_moisture}%</p>
            </div>

            <div
              className={
                item.pump_status === "ON"
                  ? "control-status on"
                  : "control-status off"
              }
            >
              Pompa {item.pump_status}
            </div>

            <button
              className="pump-btn wide"
              onClick={() => togglePump(item.id, item.pump_status)}
            >
              {item.pump_status === "ON" ? "Matikan Pompa" : "Nyalakan Pompa"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

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
        </div>
      </section>
    </div>
  );
}

function ComparisonPage() {
  const platforms = [
    {
      name: "Blynk",
      type: "IoT Platform",
      strengths: "Mudah digunakan, drag & drop widget, cocok untuk ESP32.",
      weakness: "Tampilan kurang fleksibel dan bergantung pada platform.",
      status: "Referensi",
    },
    {
      name: "ThingsBoard",
      type: "IoT Dashboard",
      strengths: "Cocok untuk IoT skala besar dan support rule automation.",
      weakness: "Setup lebih kompleks untuk project sederhana.",
      status: "Pembanding",
    },
    {
      name: "Grafana",
      type: "Data Visualization",
      strengths: "Visualisasi grafik kuat dan cocok untuk data real-time.",
      weakness: "Kurang native untuk kontrol device secara langsung.",
      status: "Pembanding",
    },
    {
      name: "Web Custom",
      type: "React + Express",
      strengths: "Desain bebas, bisa pakai backend, database, dan localhost.",
      weakness: "Butuh coding lebih banyak.",
      status: "Dipilih",
    },
  ];

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>Comparison Dashboard</h1>
          <p>
            Halaman ini membandingkan beberapa platform dashboard IoT dengan web
            dashboard custom yang dibuat pada project ini.
          </p>
        </div>

        <BarChart3 size={42} />
      </section>

      <section className="comparison-grid">
        {platforms.map((item) => (
          <div
            className={
              item.status === "Dipilih"
                ? "comparison-card selected"
                : "comparison-card"
            }
            key={item.name}
          >
            <div className="comparison-top">
              <div>
                <h3>{item.name}</h3>
                <p>{item.type}</p>
              </div>

              <span>{item.status}</span>
            </div>

            <div className="comparison-content">
              <strong>Kelebihan</strong>
              <p>{item.strengths}</p>

              <strong>Kekurangan</strong>
              <p>{item.weakness}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h3>Alasan Memilih Web Custom</h3>
          <span>React Vite + Express + Supabase</span>
        </div>

        <p className="comparison-text">
          Project ini memilih web dashboard custom karena lebih fleksibel dari
          sisi tampilan, struktur frontend-backend, integrasi database, dan
          dapat dijalankan di localhost. Blynk, ThingsBoard, dan Grafana
          digunakan sebagai referensi pembanding dashboard IoT.
        </p>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>About System</h1>
          <p>Informasi singkat mengenai konsep dan teknologi yang digunakan.</p>
        </div>

        <Info size={42} />
      </section>

      <section className="about-grid">
        <div className="panel">
          <h3>Konsep Sistem</h3>
          <p>
            Smart Farming Dashboard adalah sistem monitoring berbasis web yang
            digunakan untuk menampilkan kondisi lahan pertanian. Data yang
            digunakan merupakan data dummy sensor IoT seperti suhu, kelembaban
            tanah, kelembaban udara, cahaya, dan status pompa.
          </p>
        </div>

        <div className="panel">
          <h3>Teknologi</h3>
          <ul className="about-list">
            <li>Frontend: React Vite</li>
            <li>Backend: Node.js Express</li>
            <li>Database: Supabase PostgreSQL</li>
            <li>Visualisasi: Recharts</li>
            <li>Icon: Lucide React</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Alur Sistem</h3>
          <p>
            Data dummy sensor disimpan di Supabase. Backend mengambil data dari
            Supabase melalui API, lalu frontend menampilkan data tersebut dalam
            bentuk card, grafik, tabel, denah visual, alert, report, dan
            rekomendasi sistem.
          </p>
        </div>

        <div className="panel">
          <h3>Tujuan</h3>
          <p>
            Dashboard ini dibuat untuk memudahkan pengguna memahami kondisi
            lahan secara cepat melalui visualisasi data dan simulasi kontrol
            pompa.
          </p>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [sensors, setSensors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = async () => {
    try {
      const sensorRes = await axios.get(`${API_URL}/api/sensors`);
      const summaryRes = await axios.get(`${API_URL}/api/summary`);

      setSensors(sensorRes.data);
      setSummary(summaryRes.data);
      setLastUpdate(new Date().toLocaleTimeString("id-ID"));
    } catch (error) {
      console.log("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const togglePump = async (id, currentStatus) => {
    const newStatus = currentStatus === "ON" ? "OFF" : "ON";

    try {
      await axios.put(`${API_URL}/api/pump/${id}`, {
        pump_status: newStatus,
      });

      fetchData();
    } catch (error) {
      console.log("Gagal mengubah pompa:", error);
    }
  };

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={
            <DashboardPage
              sensors={sensors}
              summary={summary}
              lastUpdate={lastUpdate}
              fetchData={fetchData}
              togglePump={togglePump}
            />
          }
        />

        <Route
          path="/data-sensor"
          element={<DataSensorPage sensors={sensors} togglePump={togglePump} />}
        />

        <Route
          path="/control"
          element={
            <ControlPanelPage sensors={sensors} togglePump={togglePump} />
          }
        />

        <Route
          path="/report"
          element={<ReportPage sensors={sensors} summary={summary} />}
        />

        <Route path="/comparison" element={<ComparisonPage />} />

        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;