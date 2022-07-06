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
const map = L.map('map', {
  center: [41.3962, 2.1547],
  zoom: 13,
  zoomControl: false
})

// Tiles
const CartoDBVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/attributions">Carto</a>',
  subdomains: 'abcd',
  maxZoom: 20
});

const WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; Esri'
});

const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

// Add default tiles to map
CartoDBVoyager.addTo(map);

// Base maps object
const baseMaps = {
  "Base": CartoDBVoyager,
  "Topogràfic": WorldTopoMap,
  "Dark": Stadia_AlidadeSmoothDark
};

// Custom markers
const blueNyap = L.icon({
  iconUrl: './images/map-marker-icon.png',
  shadowUrl: './images/marker-shadow.png',
  iconSize: [27, 41], // size of the icon
  shadowSize: [41, 41], // size of the shadow
  iconAnchor: [13, 10], // point of the icon which will correspond to marker's location
  shadowAnchor: [13, 10],  // the same for the shadow
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

const invisibleMarker = L.icon({
  iconUrl: './images/invisible_marker.png',
  iconSize: [1, 1], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  shadowAnchor: [0, 0],  // the same for the shadow
  popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

// Get the carrils and add layer controls

async function showCarrilsLayers() {
  const responseBCN = await fetch(`${BASE_URL}/carrils/barcelona`)
  const carrilsBCNJson = await responseBCN.json()

  const responseAMB = await fetch(`${BASE_URL}/carrils/amb`)
  const carrilsAMBJson = await responseAMB.json()

  const responseUnderConstruction = await fetch(`${BASE_URL}/carrils/enconstruccio`)
  const carrilsUnderConstructionJson = await responseUnderConstruction.json()

  const responseCorredors = await fetch(`${BASE_URL}/carrils/corredorsbici`)
  const corredorsJson = await responseCorredors.json()

  const greenStyle = {
    color: 'green',
    opacity: 0.45,
    weight: 4
  }

  const redStyle = {
    color: 'red',
    opacity: 0.45,
    weight: 4
  }

  const blueStyle = {
    color: 'blue',
    opacity: 0.45,
    weight: 4
  }
  const carrilsBCN = L.geoJSON(carrilsBCNJson, { style: greenStyle })
  const carrilsAMB = L.geoJSON(carrilsAMBJson, { style: greenStyle })
  const carrilsUnderConstruction = L.geoJSON(carrilsUnderConstructionJson, { style: redStyle })
  const corredorsBici = L.geoJSON(corredorsJson, { style: blueStyle })

  // Add controls to map
  let overlayMaps = {
    "Carrils BCN": carrilsBCN,
    "Carrils AMB": carrilsAMB,
    "En construcció": carrilsUnderConstruction,
    "Corredors bici": corredorsBici
  }
  L.control.layers(baseMaps, overlayMaps).addTo(map)

}
//Call the function
showCarrilsLayers()


// Get the nyaps from the DB
fetch(`${BASE_URL}/nyaps`)
  .then(response => response.json())
  .then(nyapsObject => {
    const nyapsArray = nyapsObject.nyaps;
    nyapsArray.forEach(nyap => {

      const popupContent = `<strong>${nyap.title}</strong><br><p>${nyap.description}</p><img src="${nyap.image}" alt="${nyap.title}" width="300rem">`
      const popupOptions = {
        closeButton: false,
        className: 'nyap-popup'
      }

      L.marker([nyap.latitude, nyap.longitude], { icon: blueNyap }).addTo(map).bindPopup(popupContent, popupOptions);

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
  const popupContent = `<button onclick="newNyapQueue(${latLng.lat},${latLng.lng})" id="newNyapSubmit">NOU NYAP!</button>`
  const popupOptions = {
    closeButton: false,
    className: 'new-nyap-popup'
  }

  newNyapMarker = L.marker([latLng.lat, latLng.lng], { icon: invisibleMarker }).addTo(map).bindPopup(popupContent, popupOptions).openPopup()

})

//////// NEW NYAP QUEUE ////////

async function newNyapQueue(latitude, longitude) {

  let Q1 = await newNyapCategoryQ1()
  let Q2 = await newNyapDescriptionQ2(Q1.isDismissed)
  let Q3 = await newNyapImageQ3(Q2.isDismissed)
  let Q4 = await newNyapReviewQ4(Q3.isDismissed, Q1.value, Q2.value, Q3.value)
  while (Q4.isDenied) {
    Q1 = await newNyapCategoryQ1(Q1.value)
    Q2 = await newNyapDescriptionQ2(Q1.isDismissed, Q2.value)
    Q3 = await newNyapImageQ3(Q2.isDismissed, Q3.value)
    Q4 = await newNyapReviewQ4(Q3.isDismissed, Q1.value, Q2.value, Q3.value)
  }
  let Q5 = await newNyapSuccessQ5(Q4.isDismissed)
  map.removeLayer(newNyapMarker)
  let Q6 = await newNyapAuthorEmailQ6(Q5.isDismissed)

  let newNyap = {
    category: Q1.value,
    description: Q2.value,
    latitude: latitude,
    longitude: longitude
  }

  if (Q6.value) {
    newNyap.authorEmail = Q6.value
  }

  if (Q3.value) {
    const imageUrl = await postImage(Q3.value);
    newNyap.image = imageUrl
  }

  // Add conditions! ******************************************************
  await postNyap(newNyap)

}

async function postImage(image) {
  const formData = new FormData()
  formData.append('file', image)

  const options = {
    method: 'POST',
    body: formData
  };

  const response = await fetch('/image/post', options)

  return response.statusText
}

async function postNyap(newNyap) {
  return await fetch(`${BASE_URL}/nyaps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNyap),
  })
}

async function newNyapCategoryQ1(prevInputValue) {
  let alertConf = {
    text: 'Tria una categoria',
    showCloseButton: true,
    confirmButtonText: 'Següent',
    allowOutsideClick: false,
    allowEscapeKey: false,
    input: 'select',
    inputOptions: {
      'Carril interruptus': 'Carril interruptus',
      'Connexió deficient': 'Connexió deficient',
      'Desviament innecessari': 'Desviament innecessari',
      'Deteriorament': 'Deteriorament',
      'Amplada insuficient': 'Amplada insuficient',
      'Senyalització': 'Senyalització',
      'Aparcament (mal estat o manca)': 'Aparcament (mal estat o manca)',
      'Obstacles': 'Obstacles',
      'Altres': 'Altres'
    },
    inputValidator: (value) => {
      if (!value) {
        return '🙏 Cal seleccionar una categoria!'
      }
    },
    inputPlaceholder: 'De quin tipus de nyap es tracta?'
  }

  if (prevInputValue) {
    alertConf.inputValue = prevInputValue
  }

  return await Swal.fire(alertConf)
}

async function newNyapDescriptionQ2(isPrevDismissed, prevInputValue) {
  let alertConf = {
    text: 'Petita descripció del #bicinyap',
    input: 'textarea',
    inputPlaceholder: 'Intenta ser concís',
    inputValidator: (value) => {
      if (!value) {
        return '🙏 Cal incloure una descripció!'
      }
    },
    showCloseButton: true,
    confirmButtonText: 'Següent',
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
  }

  if (prevInputValue) {
    alertConf.inputValue = prevInputValue
  }

  if (!isPrevDismissed) {
    return await Swal.fire(alertConf)
  } else {
    return { isDismissed: true }
  }
}

async function newNyapImageQ3(isPrevDismissed, prevInputValue) {
  let alertConf = {
    text: 'Vols afegir una foto?',
    input: 'file',
    inputAttributes: {
      'accept': 'image/*',
      'aria-label': 'Puja la foto del nyap'
    },
    showCloseButton: true,
    confirmButtonText: 'Següent',
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    footer: `<span class="text-warning">📷 No és obligatori, però molt recomanable!</span>`,
    customClass: {
      input: 'form-control'
    }
  }

  if (prevInputValue) {
    alertConf.footer = '<span class="text-danger">📷 Pots substituir la foto anterior o clicar&nbsp;<i>Següent</i>&nbsp;per mantenir-la</span>'
    alertConf.imageUrl = URL.createObjectURL(prevInputValue)
    alertConf.text = 'Vols substituir la foto?'
  }

  if (!isPrevDismissed) {
    let Q = await Swal.fire(alertConf)
    if (Q.value === null) {
      Q.value = prevInputValue
    }
    return Q
  } else {
    return { isDismissed: true }
  }
}

async function newNyapReviewQ4(isPrevDismissed, category, description, imageFile) {
  let alertConf = {
    //title: 'És correcte la informació?',
    html: `<div class="m-5">
                  <p><strong>Categoria escollida</strong><br><i>${category}</i></p>
                  <p><strong>Descripció</strong><br><i>${description}</i></p>
                  <br>
                  <h4>És correcte la informació?</h4>
            </div>`,
    showCloseButton: true,
    showDenyButton: true,
    denyButtonText: 'Vull corretgir-la',
    denyButtonColor: 'grey',
    confirmButtonText: 'Correcte!',
    reverseButtons: false,
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      htmlContainer: 'mx-auto'
    }
  }

  if (!isPrevDismissed) {
    if (imageFile) {
      alertConf.imageUrl = URL.createObjectURL(imageFile)
    }
    return await Swal.fire(alertConf)
  } else {
    return { isDismissed: true }
  }
}

async function newNyapSuccessQ5(isPrevDismissed) {
  let alertConf = {
    icon: 'success',
    html: `<p>Moltes gràcies Bicinyaper per a la teva contribució! 🎉</p>
    <p>Els inputs de la comunitat son essencials per millorar la infraestructura ciclista.</p>
    <p>Ja estem processant la informació que ens has compartit i aviat la veuràs publicada.</p>`,
    confirmButtonText: `🚲 Endavant!`,
    footer: `<small>#bicinyap número NNNNNN</small>`,
    showCloseButton: false,
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
  }

  if (!isPrevDismissed) {
    return await Swal.fire(alertConf)
  } else {
    return { isDismissed: true }
  }
}

async function newNyapAuthorEmailQ6(isPrevDismissed) {
  let alertConf = {
    text: `Si vols que t'avisem de la publicació del teu #bicinyap, pots escriure el teu email aquí`,
    input: 'email',
    inputPlaceholder: 'Correu electrònic',
    showDenyButton: true,
    denyButtonText: 'No, gràcies',
    denyButtonColor: 'grey',
    validationMessage: 'Adreça electrònica invàlida',
    showCloseButton: false,
    showClass: {
      popup: 'none',
      backdrop: 'swal2-noanimation'
    },
    allowOutsideClick: false,
    allowEscapeKey: false
  }

  if (!isPrevDismissed) {
    return await Swal.fire(alertConf)
  } else {
    return { isDismissed: true }
  }
}

/////////////////////

//Changing URL when zoom
/*
map.on('zoomend', function () {
  var zoomLvl = map.getZoom();
  var currentUrl = window.location.href;
  var newUrl = (currentUrl.indexOf("?") > -1) ? currentUrl + "&zoom=" + zoomLvl : "?zoom=" + zoomLvl;
  window.history.pushState({}, null, newUrl);
});
*/




