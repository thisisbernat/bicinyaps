/**** BASE URL ****/
const BASE_URL = window.location.origin;

const blueNyap = L.icon({
    iconUrl: '../images/map-marker-icon.png',
    shadowUrl: '../images/marker-shadow.png',
    iconSize: [27, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [13, 10], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 10],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

/**** GET AND ITERATE NYAPS ****/
fetch(`${BASE_URL}/nyaps.json?inMap=${inMap}`)
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
            L.marker([nyap.latitude, nyap.longitude], { icon: blueNyap }).addTo(eval(id));

            toggleActions(index)
            editCategoryEvents(nyap._id, index)
            editDescriptionEvents(nyap._id, index)

            /* END FOR EACH */
        });
    })
    .catch(err => console.log(`Can't get the nyaps`));

/**** PUBLISH DIALOG ****/
function publishDialog(nyapID, index, currentInMap) {
    publishToggle(index)
    let confAlert = {
        text: 'Estàs segur que vols publicar el bicinyap?',
        icon: 'question',
        confirmButtonText: `D'acord`,
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: false
    }
    Swal.fire(confAlert)
        .then(response => {
            if (response.isConfirmed) {
                updateNyap(nyapID, { inMap: !inMap })
                hidePartial(index)
            } else {
                publishToggle(index)
            }
        })
        .catch(err => console.log(err))
}

function hidePartial(index) {
    const partial = document.getElementById(`partial-${index}`)
    const parent = partial.parentNode
    parent.classList.add('hidden')
}

/**** PUBLISH TOGGLE ****/
function publishToggle(index) {
    const elementID = `toggle${index}`
    const element = document.getElementById(elementID)
    if (element.classList.contains("fa-toggle-off")) {
        element.classList.replace('fa-toggle-off', 'fa-toggle-on')
    }
    else if (element.classList.contains("fa-toggle-on")) {
        element.classList.replace('fa-toggle-on', 'fa-toggle-off')
    }

}

/**** IMAGE DIALOG ****/
function imageDialog(nyapID, image) {
    let confAlert = {
        imageUrl: image,
        padding: '0 2rem 1rem',
        showCancelButton: true,
        denyButtonText: `<i class="fa-solid fa-pen-to-square"></i>`,
        denyButtonColor: '#0069D9',
        confirmButtonColor: '#218838',
        showDenyButton: true,
        cancelButtonText: `<i class="fa-solid fa-trash-can"></i>`,
        confirmButtonText: `<i class="fa-solid fa-check"></i>`,
        allowEnterKey: false
    }
    Swal.fire(confAlert)
        .then(res => {
            if (res.isDenied) {
                uploadImage(nyapID, image)
            }
            else if (res.isDismissed && res.dismiss === 'cancel') {
                deleteImage(nyapID)
            }
        })
}

function deleteImage(nyapID) {
    let confAlert = {
        text: 'Estàs segur que vols eliminar la imatge?',
        icon: 'question',
        confirmButtonText: `D'acord`,
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: false
    }
    Swal.fire(confAlert)
        .then(response => {
            if (response.isConfirmed) {
                updateNyap(nyapID, { image: null })
                location.reload();
            }
        })
        .catch(err => console.log(err))
}

function uploadImage(nyapID, image) {
    let confAlert = {
        text: 'Vols afegir una foto?',
        icon: 'question',
        input: 'file',
        inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'Puja la foto del nyap'
        },
        confirmButtonText: 'Puja',
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        inputValidator: (value) => {
            if (!value) {
                return '🙏 Tria un fitxer!'
            }
        }
    }
    if (image) {
        confAlert.text = 'Vols substituir la foto?'
        confAlert.confirmButtonText = 'Substitueix'
    }
    Swal.fire(confAlert)
        .then(res => {
            if (res.isConfirmed) {
                if (res.value) {
                    const formData = new FormData()
                    formData.append('file', res.value)

                    const options = {
                        method: 'POST',
                        body: formData
                    };

                    fetch('/image/post', options)
                        .then(response => {
                            fetch(`${BASE_URL}/nyap/update/${nyapID}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ image: response.statusText }),
                            })
                                .then(response => {
                                    console.log('Image posted and updated!')
                                    location.reload();
                                })
                                .catch(err => console.log(err))
                        })
                        .catch(err => console.log("Can't post the image"))
                }
            }
        })
        .catch(err => console.log(err))
}


/**** DELETE DIALOG ****/
function deleteDialog(nyapID, index) {
    let confAlert = {
        text: `Estàs segur que vols descartar l'aportació?`,
        icon: 'warning',
        confirmButtonText: `D'acord`,
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        allowOutsideClick: false,
        allowEscapeKey: false
    }
    Swal.fire(confAlert)
        .then(response => {
            if (response.isConfirmed) {
                fetch(`${BASE_URL}/nyap/delete/${nyapID}`, {
                    method: 'POST'
                })
                    .then(() => hidePartial(index))
                    .catch(err => console.log('Error deleting the nyap', err))
            }
        })
        .catch(err => console.log(err))
}

/**** TOGGLE ACTIONS EVENT ****/
function toggleActions(index) {
    const partial = document.getElementById(`partial-${index}`)
    const actions = document.getElementById(`actions-${index}`)
    partial.addEventListener('mouseover', event => {
        actions.classList.remove('hidden')
    })

    partial.addEventListener('mouseout', event => {
        actions.classList.add('hidden')
    })
}

/**** EDIT CATEGORY EVENTS ****/
function editCategoryEvents(nyapID, index) {
    const category = document.getElementById(`category-${index}`)
    category.addEventListener('mouseover', event => {
        category.lastChild.classList.remove('hidden')
    })

    category.addEventListener('mouseout', event => {
        category.lastChild.classList.add('hidden')
    })

    category.addEventListener('click', event => {
        editCategory(nyapID, category)
    })
}

/**** EDIT DESCRIPTION EVENTS ****/
function editDescriptionEvents(nyapID, index) {
    const description = document.getElementById(`description-${index}`)
    description.addEventListener('mouseover', event => {
        description.lastChild.classList.remove('hidden')
    })

    description.addEventListener('mouseout', event => {
        description.lastChild.classList.add('hidden')
    })

    description.addEventListener('click', event => {
        editDescription(nyapID, description)
    })
}

/**** EDIT CATEGORY ****/
function editCategory(nyapID, category) {
    const inputValue = category.childNodes[0].nodeValue
    let confAlert = {
        text: 'Vols editar la categoria?',
        confirmButtonText: `D'acord`,
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: false,
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
        inputValue: inputValue
    }
    Swal.fire(confAlert)
        .then(response => {
            if (response.isConfirmed) {
                updateNyap(nyapID, { category: response.value })
                category.innerHTML = `${response.value}<span class="hidden"> <i class="fa-solid fa-pen text-secondary"></i></span>`
            }
        })
        .catch(err => console.log(err))
}

/**** EDIT DESCRIPTION ****/
function editDescription(nyapID, description) {
    const inputValue = description.childNodes[0].nodeValue
    let confAlert = {
        text: 'Vols editar la categoria?',
        confirmButtonText: `D'acord`,
        showCancelButton: true,
        cancelButtonText: 'Cancel·lar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: false,
        input: 'textarea',
        inputValue: inputValue,
        inputPlaceholder: 'Intenta ser concís',
        inputValidator: (value) => {
            if (!value) {
                return '🙏 Cal incloure una descripció!'
            }
        }
    }
    Swal.fire(confAlert)
        .then(response => {
            if (response.isConfirmed) {
                updateNyap(nyapID, { description: response.value })
                description.innerHTML = `${response.value}<span class="hidden"> <i class="fa-solid fa-pen text-secondary"></i></span>`
            }
        })
        .catch(err => console.log(err))
}


/**** UPDATE NYAP ****/

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

