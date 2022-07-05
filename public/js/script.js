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

const Stadia = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

const Sunny = L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
  attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 0,
  maxZoom: 22,
  subdomains: 'abcd',
  accessToken: 'x6vJ9RpqyN7F8wBcZK1xu8xS16LaRv5OpGrlmBdtBffUeYmYmbUiySjNMfp5rsY7'
});

const WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

// Add default tiles to map
Sunny.addTo(map);

// Base maps object
const baseMaps = {
  "Carto": CartoDBVoyager,
  "Google": googleStreets,
  "Stadia": Stadia,
  "Sunny": Sunny,
  "WTM": WorldTopoMap
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
  newNyapMarker.bindPopup(`<button type="button" onclick="newNyapQueue(${latLng.lat},${latLng.lng})" id="newNyapSubmit" class="btn btn-info btn-sm">Submit</button>`, { closeButton: false }).openPopup();
})

//////// NEW ////////

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

  if (titleDismissed) {
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

  if (descriptionDismissed) {
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

  if (emailDismissed) {
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




