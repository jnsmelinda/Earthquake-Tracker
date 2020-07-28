const lastHourQuakes = [];

$(document).ready(
    getdailyQuakes()
);

$(document).ready(
    placeToCordinates("seattle"),
);

function getdailyQuakes() {
    $.ajax({ url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson" })
        .then(
            (response) => collectData(response.features)
        );
}

function collectData(features) {
    for (let i = 0; i < features.length; i++) {
        const element = features[i];
        const place = element.properties.place;
        const coords = element.geometry.coordinates;
        const mag = element.properties.mag;
        const time = moment(element.properties.time).format("LLL");
        lastHourQuakes.push({ place: place, coords: coords, mag: mag, time: time });
    }
    console.log('Eartquakes in the past hour:');
    console.log(lastHourQuakes);
}

function getCoordinates() {
    coords = [];
    for (let i = 0; i < lastHourQuakes.length; i++) {
        coords.push(lastHourQuakes[i].coords);
    }

    return coords;
}

function placeToCordinates(place) {
    const apiKey = '9bdca107dee44c8d90c4efabb9b500e4';
    $.ajax({ url: `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}`})
        .then(
            (response) => dataByLocation(response.results[0].geometry.lat, response.results[0].geometry.lng)
        );
}

function dataByLocation(lat, lon) {
    const radius = "100";
    const startTime = "2020-07-01";
    const endTime = "2020-07-27";
    console.log('Eartquakes by City:');
    $.ajax({ url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&longitude=${lon}&latitude=${lat}&maxradiuskm=${radius}`})
        .then(
            (response) => console.log(response.features)
        );
}


