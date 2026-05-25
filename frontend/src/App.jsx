import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ControlPanelPage from "./pages/ControlPanelPage";
import ReportPage from "./pages/ReportPage";
import AboutPage from "./pages/AboutPage";

import "./App.css";

const API_URL = "http://localhost:5000";

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

    const interval = setInterval(fetchData, 60000);

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
          path="/control"
          element={
            <ControlPanelPage sensors={sensors} togglePump={togglePump} />
          }
        />

        <Route
          path="/report"
          element={<ReportPage sensors={sensors} summary={summary} />}
        />

        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;