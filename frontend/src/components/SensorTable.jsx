import { Database } from "lucide-react";

function SensorTable({ sensors, getStatusClass, getStatusLabel }) {
  return (
    <section className="sensor-table-section">
      <div className="table-header-card">
        <div className="table-title-area">
          <div className="title-icon-box">
            <Database size={24} />
          </div>
          <div>
            <h3>Data Sensor Terkini</h3>
            <span>Monitoring langsung dari database Supabase</span>
          </div>
        </div>
        <div className="table-badges">
          <span className="live-badge">
            <span className="pulse-dot"></span> Live
          </span>
        </div>
      </div>

      <div className="table-wrapper premium-table-wrapper">
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
            </tr>
          </thead>

          <tbody>
            {sensors.map((item) => (
              <tr key={item.id}>
                <td><strong>{item.area}</strong></td>
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
              </tr>
            ))}

            {sensors.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-state-td">
                  <Database size={32} opacity={0.3} />
                  <p>Data sensor belum tersedia.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SensorTable;