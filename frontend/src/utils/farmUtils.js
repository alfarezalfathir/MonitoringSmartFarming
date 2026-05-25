export function getGlobalStatusClass(item) {
  const soil = Number(item.soil_moisture);
  const temp = Number(item.temperature);

  if (soil < 25 || temp > 33) return "critical";
  if (soil < 40 || temp > 31) return "warning";
  return "normal";
}

export function getGlobalStatusLabel(item) {
  const status = getGlobalStatusClass(item);

  if (status === "critical") return "Kritis";
  if (status === "warning") return "Waspada";
  return "Normal";
}

export function getLabelFromStatus(status) {
  if (status === "critical") return "Kritis";
  if (status === "warning") return "Waspada";
  return "Normal";
}

export function getRecommendation(item) {
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