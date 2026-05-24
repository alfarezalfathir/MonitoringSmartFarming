import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
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
  Home as HomeIcon,
  Info,
  LayoutDashboard,
  Search,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";
const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444"];

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <Sprout size={22} />
        <span>SmartFarm</span>
      </div>

      <div className="nav-links">
        <NavLink to="/">
          <HomeIcon size={16} />
          Home
        </NavLink>
        <NavLink to="/dashboard">
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/data-sensor">
          <Database size={16} />
          Data Sensor
        </NavLink>
        <NavLink to="/control">
          <Settings size={16} />
          Control Panel
        </NavLink>
        <NavLink to="/about">
          <Info size={16} />
          About
        </NavLink>
      </div>
    </nav>
  );
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

function DashboardPage({ sensors, summary, lastUpdate, fetchData, togglePump }) {
  const getStatusClass = (item) => {
    const soil = Number(item.soil_moisture);
    const temp = Number(item.temperature);

    if (soil < 25 || temp > 33) return "critical";
    if (soil < 40 || temp > 31) return "warning";
    return "normal";
  };

  const getStatusLabel = (item) => {
    const soil = Number(item.soil_moisture);
    const temp = Number(item.temperature);

    if (soil < 25 || temp > 33) return "Kritis";
    if (soil < 40 || temp > 31) return "Waspada";
    return "Normal";
  };

  const statusData = [
    {
      name: "Normal",
      value: sensors.filter((item) => getStatusClass(item) === "normal").length,
    },
    {
      name: "Waspada",
      value: sensors.filter((item) => getStatusClass(item) === "warning").length,
    },
    {
      name: "Kritis",
      value: sensors.filter((item) => getStatusClass(item) === "critical").length,
    },
  ];

  const criticalSensors = sensors.filter(
    (item) => getStatusClass(item) === "critical"
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
            <h3>Denah Visual Petak Lahan</h3>
            <span>Warna menandakan kondisi lahan</span>
          </div>

          <div className="land-grid">
            {sensors.map((item) => (
              <div className={`land-card ${getStatusClass(item)}`} key={item.id}>
                <div className="land-top">
                  <strong>{item.area}</strong>
                  <span>{getStatusLabel(item)}</span>
                </div>

                <div className="land-visual">
                  <Sprout size={34} />
                </div>

                <div className="land-detail">
                  <p>
                    <Droplets size={15} /> {item.soil_moisture}%
                  </p>
                  <p>
                    <Thermometer size={15} /> {item.temperature}°C
                  </p>
                  <p>
                    <Sun size={15} /> {item.light} lux
                  </p>
                </div>
              </div>
            ))}
          </div>
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
        getStatusClass={getStatusClass}
        getStatusLabel={getStatusLabel}
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

  const getStatusClass = (item) => {
    const soil = Number(item.soil_moisture);
    const temp = Number(item.temperature);

    if (soil < 25 || temp > 33) return "critical";
    if (soil < 40 || temp > 31) return "warning";
    return "normal";
  };

  const getStatusLabel = (item) => {
    const status = getStatusClass(item);
    if (status === "critical") return "Kritis";
    if (status === "warning") return "Waspada";
    return "Normal";
  };

  const filteredSensors = sensors.filter((item) => {
    const matchSearch = item.area.toLowerCase().includes(search.toLowerCase());
    const label = getStatusLabel(item);
    const matchFilter = filter === "Semua" || label === filter;

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
          sensors={filteredSensors}
          togglePump={togglePump}
          getStatusClass={getStatusClass}
          getStatusLabel={getStatusLabel}
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
            bentuk card, grafik, tabel, denah visual, dan alert.
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

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

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

        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;