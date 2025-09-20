// Coordenadas Universidad Distrital - Sede 40 (Facultad de Ingeniería)
const sede40 = [4.627914419910086, -74.06594839014724];
let sede40Poligono = [];

// Crear el mapa y centrarlo en la sede
const map = L.map('map', {
  center: sede40,
  zoom: 20, // zoom más cercano para ver el campus
  minZoom: 5,
  maxZoom: 18
});

// Leer archivo GeoJSON
fetch("documentos/map.geojson")
  .then(res => {
    if (!res.ok) throw new Error("No se pudo cargar el archivo");
    return res.json(); // convierte a JSON directo
  })
  .then(data => {
    // Extraer polígono y convertir [lng, lat] → [lat, lng]
    sede40Poligono = data.features[0].geometry.coordinates[0]
      .map(c => [c[1], c[0]]);

    // Capa de teselas OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Polígono
    L.polygon(sede40Poligono, {
      color: 'red',
      weight: 2,
      fillColor: '#f03',
      fillOpacity: 0.2
    }).addTo(map).bindPopup("Universidad Distrital - Sede 40");

    // Escala
    L.control.scale().addTo(map);

    // Calcular centroide (ahora que ya tenemos coordenadas)
    const centroide = getPolygonCentroid(sede40Poligono);

    // Agregar marcador en el centroide
    L.marker(centroide).addTo(map)
      .bindPopup('<b>Centroide Universidad Distrital</b><br>Sede Facultad de Ingeniería - Calle 40');

    console.log("GeoJSON cargado:", sede40Poligono);
  })
  .catch(err => console.error("Error al leer el GeoJSON:", err));

// Función para calcular centroide
function getPolygonCentroid(coords) {
  let area = 0, x = 0, y = 0;

  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0], yi = coords[i][1];
    const xj = coords[j][0], yj = coords[j][1];

    const f = xi * yj - xj * yi;
    area += f;
    x += (xi + xj) * f;
    y += (yi + yj) * f;
  }

  area *= 0.5;
  const factor = area * 6.0;

  return [x / factor, y / factor];
}

