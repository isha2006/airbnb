// Only run if map div exists
if (document.getElementById('map') && typeof geometry !== "undefined") {
  const [lng, lat] = geometry.coordinates;
  const map = L.map('map').setView([lat, lng], 13);

  L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${mapToken}`, {
    attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(map);

  // Optionally add a marker:
  L.marker([lat, lng]).addTo(map)
    .bindPopup('Listing Location')
    .openPopup();
}
