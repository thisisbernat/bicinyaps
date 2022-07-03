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

// EVENT TO ADD NEW NYAP
let newNyapMarker;
map.on('contextmenu', e => {
  if (typeof newNyapMarker !== 'undefined') {
    map.removeLayer(newNyapMarker)
  }
  let latLng = map.mouseEventToLatLng(e.originalEvent)
  newNyapMarker = L.marker([latLng.lat, latLng.lng], { draggable: true }).addTo(map)
  //newNyapMarker.bindPopup(`<form action="${BASE_URL}/nyaps" method="post"><input type="text" name="title" placeholder="Títol"><br><br><input type="text" name="description" placeholder="Descripció"><br><br><input type="hidden" name="latitude" id="latitude" value="${latLng.lat}"><input type="hidden" name="longitude" id="longitude" value="${latLng.lng}"><input type="hidden" name="inMap" value="true"><input type="submit" value="Submit"></form>`)
  newNyapMarker.bindPopup(`<button type="button" onclick="newNyapForm(${latLng.lat}, ${latLng.lng})" id="newNyapSubmit" class="btn btn-info btn-sm">Submit</button>`, { closeButton: false }).openPopup();
})

async function newNyapForm(latitude, longitude) {
  let steps = ['1', '2', '3']
  const Queue = Swal.mixin({
    progressSteps: steps,
    confirmButtonText: 'Següent',
    showCloseButton: true,
    showClass: { backdrop: 'swal2-noanimation' },
    hideClass: { backdrop: 'swal2-noanimation' }
  })

  const { value: title, isDenied: titleDismissed } = await Queue.fire({
    text: 'Títol #bicinyap',
    input: 'text',
    inputPlaceholder: 'Títol identificatiu del #bicinyap',
    inputValidator: (value) => {
      if (!value) {
        return 'Cal posar un títol!'
      }
    },
    currentProgressStep: 0,
    showClass: { backdrop: 'swal2-noanimation' },
    showDenyButton: true,
    denyButtonText: 'Sortir',
    preDeny: () => Swal.fire('segur?')
  })

  if(titleDismissed) {
    return
  }

 const { value: description, isDismissed: descriptionDismissed } = await Queue.fire({
    text: 'Descripció #bicinyap',
    input: 'textarea',
    inputPlaceholder: 'Petita descripció del #bicinyap',
    inputValidator: (value) => {
      if (!value) {
        return 'Cal incloure una descripció!'
      }
    },
    currentProgressStep: 1,
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    }
  })

  if(descriptionDismissed) {
    return
  }

  const { value: email, isDismissed: emailDismissed } = await Queue.fire({
    text: `Si vols que t'avisem de la publicació del teu #bicinyap, pots escriure el teu email aquí`,
    input: 'email',
    inputPlaceholder: 'Correu electrònic',
    currentProgressStep: 2,
    confirmButtonText: 'Enviar!',
    showCancelButton: true,
    cancelButtonText: 'Continuar sense email',
    reverseButtons: true,
    validationMessage: 'Adreça electrònica invàlida',
    showClass: { backdrop: 'swal2-noanimation' }
  })

  if(emailDismissed) {
    return
  }

  if (title && description) {
    const newNyap = {
      title,
      description,
      latitude,
      longitude
    };

    console.log(newNyap)

    fetch(`${BASE_URL}/nyaps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNyap),
    })
      .then(result => {
        Swal.fire({
          icon: 'success',
          html: `<p>Moltes gràcies Bicinyaper per a la teva contribució!</p>
              <p>Els inputs de la comunitat son essencials per millorar la infraestructura ciclista.</p>
              <p>Ja estem processant la informació que ens has compartit i aviat la veuràs publicada.</p>`,
          confirmButtonText: `You've been nyaped!`,
          footer: `<small>#bicinyap número NNNNNN</small>`
        }).then(function () {
          window.location = `${BASE_URL}`;
        });
      })
      .catch(error => console.log(error))


  }
}





//Changing URL when zoom
/*
map.on('zoomend', function () {
  var zoomLvl = map.getZoom();
  var currentUrl = window.location.href;
  var newUrl = (currentUrl.indexOf("?") > -1) ? currentUrl + "&zoom=" + zoomLvl : "?zoom=" + zoomLvl;
  window.history.pushState({}, null, newUrl);
});
*/




