import { Info } from "lucide-react";

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
            <li>Visual Map: Three.js 3D Model</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Alur Sistem</h3>
          <p>
            Data dummy sensor disimpan di Supabase. Backend mengambil data dari
            Supabase melalui API, lalu frontend menampilkan data tersebut dalam
            bentuk card, grafik, tabel, denah visual 3D, alert, report, dan
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

export default AboutPage;