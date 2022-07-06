


/**** MAP ****/
const CartoDBVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">Carto</a>',
    subdomains: 'abcd',
    maxZoom: 20
});
const map = L.map('map1', {
    center: [41.3962, 2.1547], zoom: 16, zoomControl:
        false
})

CartoDBVoyager.addTo(map);

L.marker([41.3962, 2.1547]).addTo(map)