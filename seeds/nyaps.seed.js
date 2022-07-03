const nyaps = [
    {
        title: 'Diputació/Tarragona',
        description: 'El carril bidireccional més estret del món',
        latitude: 41.37648,
        longitude: 2.14855,
        image: 'https://pbs.twimg.com/media/EehAB1OWAAExHfS?format=jpg&name=large',
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Paral·lel/Espanya',
        description: 'Últim tram del carril bici desaparegut',
        latitude: 41.37508,
        longitude: 2.15038,
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Parlament - Superilla St. Antoni',
        description: 'Els cotxes circulen sense tenir en compte les normes de la superilla. No respecten les velocitats màximes, els girs obligatòris ni la prioritat de vianants i bicicletes.',
        latitude: 41.37657,
        longitude: 2.16268,
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Psg. de Colom',
        description: 'Pilones plantades al mig del carril bici',
        latitude: 41.3786,
        longitude: 2.18032,
        image: 'https://pbs.twimg.com/media/FVNK6aBWAAIhMOM?format=jpg&name=large',
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Tetuan',
        description: 'La Plaça de Tetuan és una vergonya',
        latitude: 41.39496,
        longitude: 2.17586,
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Pelai/Bergara',
        description: `Dificultada i limitada la connexió Blai -> Bergara per culpa de l'última actuació de l'ajuntament.`,
        latitude: 41.38576,
        longitude: 2.16723,
        image: 'https://pbs.twimg.com/media/FTYm1crWQAMKb-A?format=jpg&name=large',
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Diagonal/Josep Pla',
        description: `El carril bici s'acaba inesperadament`,
        latitude: 41.41048,
        longitude: 2.21528,
        image: 'https://pbs.twimg.com/media/FI9rrAVXsAID8Yt?format=jpg&name=medium',
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    },
    {
        title: 'Provença (Sagrada Familia)',
        description: 'Vianants, turistes i ciclistes lluitem pel mateix (limitat) espai. Tram que cal replantejar i adequar urgentment.',
        latitude: 41.40401,
        longitude: 2.17385,
        image: 'https://pbs.twimg.com/media/FVMu6ZWXEAAurLr?format=jpg&name=large',
        inMap: true,
        creator: {
            name: 'Seed',
            email: 'seed@bicinyaps.com'
        }
    }
];

const Nyap = require("../models/Nyap.model");
const mongoose = require("mongoose");

const MONGODB_URI = 'mongodb://localhost/bicinyapsdb';

mongoose
    .connect(MONGODB_URI)
    .then((response) => {
        console.log(`Connected to the database: "${response.connection.name}"`);

        //Empty the collection
        Nyap.collection.drop();
    })
    .then(response => {
        return Nyap.insertMany(nyaps);
    })
    .then((response) => {
        console.log(`Els nyaps s'han guardat correctament i el seu valor és: `, response);

        // Disconnection
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log('Hi ha hagut un error en guardar el seed de nyaps: ', err)
    });