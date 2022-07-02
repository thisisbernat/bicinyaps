/*
document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("JS imported successfully!");
  },
  false
);
*/
const BASE_URL = window.location.origin;

// Setup init
const map = L.map('map').setView([41.3870, 2.1700], 13);

// Tiles
const CartoDBVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/attributions">Carto</a>',
  subdomains: 'abcd',
  maxZoom: 20
});

const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
  attribution: '&copy; <a href="https://www.google.com">Google</a>',
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Add default tiles to map
CartoDBVoyager.addTo(map);

// Base maps object
const baseMaps = {
  "Carto": CartoDBVoyager,
  "Google": googleStreets
};

// Get the carrils and add layer controls
fetch(`${BASE_URL}/carrilsbcn`)
  .then(res => res.json())
  .then(carrilsObject => {
    const carrils = L.geoJSON(carrilsObject, {
      style: {
        color: 'green',
        opacity: 0.25,
        weight: 4
      }
    })
    // Add controls to map
    const overlayMaps = {
      "Carrils Bici": carrils
    }
    L.control.layers(baseMaps, overlayMaps).addTo(map);
  })
  .catch(err => console.log(`Can't get the carrils`));

  // Get the nyaps from the DB
fetch(`${BASE_URL}/nyaps`)
.then(response => response.json())
.then(nyapsObject => {
  const nyapsArray = nyapsObject.nyaps;
  nyapsArray.forEach(nyap => {
    //console.log(nyap)
    L.marker([nyap.latitude, nyap.longitude]).addTo(map)
      .bindPopup(`<strong>${nyap.title}</strong><br><p>${nyap.description}</p><img src="${nyap.image}" alt="${nyap.title}" width="300rem">`);
  });
})
.catch(err => console.log(`Can't get the nyaps`));

