document.addEventListener(
  "DOMContentLoaded",
  () => {
    let alertConf = {
      text: 'Fes botó dret sobre el mapa per afegir un #bicinyap!',
      html: `<i class="fa-solid fa-circle-info"></i> <span>Fes botó dret sobre el mapa per afegir un #bicinyap!</span>`,
      target: '#map',
      customClass: {
        container: 'position-absolute'
      },
      toast: true,
      position: 'bottom-start',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
      grow: true
    }
    Swal.fire(alertConf)
  },
  false
);

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

const Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});

// Add default tiles to map
CartoDBVoyager.addTo(map);

// Base maps object
const baseMaps = {
  "Base": CartoDBVoyager,
  "Topogràfic": WorldTopoMap,
  "B/N": Stamen_TonerLite
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


// GET THE NYAPS IN MAP
fetch(`${BASE_URL}/nyaps.json?inMap=true`)
  .then(response => response.json())
  .then(nyapsObject => {
    const nyapsArray = nyapsObject.nyaps;
    nyapsArray.forEach(nyap => {
      let popupContent
      if (!nyap.image) {
        popupContent = `<strong>Categoria: </strong><em>${nyap.category}</em><br><p class="text-justify">${nyap.description}</p><strong>Vots: </strong><em id="nyap-votes-${nyap._id}">${nyap.votes}</em>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" style="color:white;" onclick="voteForNyap('${nyap._id}')"><i class="fa-solid fa-thumbs-up pointer"></i></a>`
      }
      else if (nyap.image) {
        popupContent = `<img src="${nyap.image}" alt="${nyap.title}" width="300rem" class="shadow-lg" style="margin-bottom:10px;border-radius: 5px;"><strong>Categoria: </strong><em>${nyap.category}</em><br><p class="text-justify">${nyap.description}</p><strong>Vots: </strong><em id="nyap-votes-${nyap._id}">${nyap.votes}</em>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" style="color:white;" onclick="voteForNyap('${nyap._id}')"><i class="fa-solid fa-thumbs-up pointer"></i></a>`
      }
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
  return await fetch(`${BASE_URL}/nyap`, {
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
    padding: '0 2rem 1rem',
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
    padding: '0 2rem 1rem',
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
  let nyaps = await getNyapsCount()

  let alertConf = {
    icon: 'success',
    html: `<p>Moltes gràcies Bicinyaper per a la teva contribució! 🎉</p>
    <p>Els inputs de la comunitat son essencials per millorar la infraestructura ciclista.</p>
    <p>Ja estem processant la informació que ens has compartit i aviat la veuràs publicada.</p>`,
    confirmButtonText: `🚲 Endavant!`,
    footer: `<small>#bicinyap número ${nyaps.count}</small>`,
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

async function getNyapsCount() {
  const response = await fetch(`${BASE_URL}/nyaps/count`)
  const nyaps = await response.json();
  return nyaps;
}

function voteForNyap(nyapID) {
  fetch(`${BASE_URL}/ip-address`)
    .then(response => {
      if (response.status === 200) {
        getNyapVotes(nyapID)
          .then(response => {
            let oneMoreVote = response.votes + 1
            updateNyap(nyapID, { votes: oneMoreVote })
            const voteCount = document.getElementById(`nyap-votes-${nyapID}`)
            voteCount.innerText = oneMoreVote

            fetch(`${BASE_URL}/ip-address`, {method: 'POST'})
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))   
}

async function getNyapVotes(nyapID) {
  const response = await fetch(`${BASE_URL}/nyap/${nyapID}/votes`)
  const votes = await response.json();
  return votes;
}

function updateNyap(nyapID, updateObject) {
  fetch(`${BASE_URL}/nyap/update/${nyapID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateObject),
  })
    .then(response => {
      console.log('Nyap updated!')
    })
    .catch(err => console.log(err))
}
