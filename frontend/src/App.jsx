import { useEffect, useState } from "react";
import axios from "axios";
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
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000";
const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444"];

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
    </div>
  );
}

export default App;