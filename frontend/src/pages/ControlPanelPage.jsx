import { Settings } from "lucide-react";

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

        {sensors.length === 0 && (
          <div className="panel">
            <p>Data sensor belum tersedia.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ControlPanelPage;