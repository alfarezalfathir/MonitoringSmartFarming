const express = require("express");
const cors = require("cors");
const supabase = require("./supabaseClient");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cek server
app.get("/", (req, res) => {
  res.send("Smart Farming Backend is running");
});

// Ambil semua data sensor
app.get("/api/sensors", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Ambil ringkasan dashboard
app.get("/api/summary", async (req, res) => {
  try {
    const { data, error } = await supabase.from("sensor_data").select("*");

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const totalPetak = data.length;

    const avgSoilMoisture =
      data.reduce((sum, item) => sum + Number(item.soil_moisture), 0) /
      totalPetak;

    const maxTemperature = Math.max(
      ...data.map((item) => Number(item.temperature))
    );

    const activePump = data.filter((item) => item.pump_status === "ON").length;

    const criticalArea = data.filter(
      (item) => Number(item.soil_moisture) < 25 || Number(item.temperature) > 32
    ).length;

    res.json({
      totalPetak,
      avgSoilMoisture: avgSoilMoisture.toFixed(1),
      maxTemperature,
      activePump,
      criticalArea,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update status pompa
app.put("/api/pump/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pump_status } = req.body;

    const { data, error } = await supabase
      .from("sensor_data")
      .update({ pump_status })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({
      message: "Status pompa berhasil diubah",
      data,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});