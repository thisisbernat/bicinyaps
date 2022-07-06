/**** BASE URL ****/
const BASE_URL = window.location.origin;

const blueNyap = L.icon({
    iconUrl: './images/map-marker-icon.png',
    shadowUrl: './images/marker-shadow.png',
    iconSize: [27, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [13, 10], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 10],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
  });

/**** NYAPS ****/
fetch(`${BASE_URL}/nyaps.json?inMap=false`)
    .then(response => response.json())
    .then(nyapsObject => {
        const nyapsArray = nyapsObject.nyaps;
        nyapsArray.forEach((nyap, index) => {
            /* FOR EACH */
            const id = 'map' + index;
            window['map' + index] = L.map(eval(id), { center: [nyap.latitude, nyap.longitude], zoom: 16, zoomControl: false });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://carto.com/attributions">Carto</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(eval(id));
            L.marker([nyap.latitude, nyap.longitude]).addTo(eval(id));
            /* END FOR EACH */
        });
    })
    .catch(err => console.log(`Can't get the nyaps`));