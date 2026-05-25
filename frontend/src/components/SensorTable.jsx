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

            {sensors.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 24 }}>
                  Data sensor belum tersedia.
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