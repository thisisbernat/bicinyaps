const nyaps = [
    {
        category: 'Senyalització',
        description: `El semàfor etern només per als ciclistes, més de 10 segons dura el semàfor en groc -ni tan sols en verd- mentre els cotxes avancen. Priorització nul·la del carril bici.`,
        latitude: 41.39295,
        longitude: 2.13860,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657232258/bicinyaps/chrome_PbQwnpYumy_flcb91.png',
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: `Obstacles`,
        description: `Un tram compartit entre bicis, terrasses i vianants en una connexió amb un volum de trànsit de bicicletes molt elevat que perpetua el conflicte amb el vianant.`,
        latitude: 41.37382,
        longitude: 2.14718,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657232656/bicinyaps/chrome_sTg4k11pdx_g4pmim.png',
        inMap: false,
        authorEmail: 'initial@seed.com' 
    },
    {
        category: `Connexió deficient`,
        description: `L'ús de la bici en aquesta cruïlla és de tot menys intuïtiu. Els carrils bici de l'avinguda Josep Tarradellas, carrer Marquès de Sentmenat i París no estan enllaçats.`,
        latitude: 41.38617,
        longitude: 2.14256,
        inMap: true,
        authorEmail: 'initial@seed.com' 
    },
    {
        category: `Amplada insuficient`,
        description: `L'amplada del carril bici de l'avinguda Josep Tarradellas és de poc més d'un metre, així que la proximitat amb els cotxes fa que la circulació sigui perillosa. A més, els avançaments entre bicis són molt complicats.`,
        latitude: 41.38794,
        longitude: 2.14289,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657232859/bicinyaps/chrome_vmOp92RxqW_tpuaqz.jpg',
        inMap: true,
        authorEmail: 'initial@seed.com' 
    },
    {
        category: `Altres`,
        description: `Carril bici per la vorera que constantment provoquen conflictes amb els vianants.`,
        latitude: 41.38105,
        longitude: 2.18619,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233179/bicinyaps/chrome_7sYdBuzOyQ_hygrbf.png',
        inMap: true,
        authorEmail: 'initial@seed.com' 
    },
    {
        category: `Carril interruptus`,
        description: `Al carrer Marina, el carril desapareix a l'alçada del carrer Ausiàs Marc`,
        latitude: 41.39720, 
        longitude: 2.18376,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233722/bicinyaps/FJAKWVIWYAMDBB2_loxafq.jpg',
        inMap: true,
        authorEmail: 'initial@seed.com' 
    },
    {
        category: 'Amplada insuficient',
        description: 'El carril bidireccional més estret del món. És impossible que dos ciclistes hi passin alhora.',
        latitude: 41.37648,
        longitude: 2.14855,
        image: 'https://pbs.twimg.com/media/EehAB1OWAAExHfS?format=jpg&name=large',
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Carril interruptus',
        description: 'Últim tram del carril bici desaparegut',
        latitude: 41.37508,
        longitude: 2.15038,
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Altres',
        description: 'Els cotxes circulen sense tenir en compte les normes de la superilla. No respecten les velocitats màximes, els girs obligatòris ni la prioritat de vianants i bicicletes.',
        latitude: 41.37657,
        longitude: 2.16268,
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Obstacles',
        description: 'Pilones plantades al mig del carril bici que suposen un perill.',
        latitude: 41.3786,
        longitude: 2.18032,
        image: 'https://pbs.twimg.com/media/FVNK6aBWAAIhMOM?format=jpg&name=large',
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Connexió deficient',
        description: `La Plaça de Tetuan és un sorral i on s'han d'esquivar arbres, bancs i vianants.`,
        latitude: 41.39496,
        longitude: 2.17586,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233228/bicinyaps/chrome_p7hqtW28Ld_dubtpq.png',
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Connexió deficient',
        description: `Dificultada i limitada la connexió Blai cap a Bergara per culpa de l'última actuació de l'ajuntament.`,
        latitude: 41.38576,
        longitude: 2.16723,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233379/bicinyaps/FTYm1crWQAMKb-A_cxvhk3.jpg',
        inMap: false,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Carril interruptus',
        description: `El carril bici s'acaba inesperadament a l'alçada del carrer de Josep Pla.`,
        latitude: 41.41048,
        longitude: 2.21528,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233407/bicinyaps/FI9rrAVXsAID8Yt_b9n4th.jpg',
        inMap: true,
        authorEmail: 'initial@seed.com'
    },
    {
        category: 'Altres',
        description: 'Vianants, turistes i ciclistes lluitem pel mateix (limitat) espai. Tram que cal replantejar i adequar urgentment.',
        latitude: 41.40401,
        longitude: 2.17385,
        image: 'https://res.cloudinary.com/dj92v0lrh/image/upload/v1657233432/bicinyaps/FVMu6ZWXEAAurLr_cnfozq.jpg',
        inMap: true,
        authorEmail: 'initial@seed.com'
    }
];

const Nyap = require("../models/Nyap.model");
const mongoose = require("mongoose");

require('dotenv/config');

mongoose
    .connect(process.env.MONGODB_URI)
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