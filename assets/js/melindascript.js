const lastHourQuakes = [];
const quakesBySearch = [];

$(document).ready(
    getdailyQuakes(),
    // placeToCordinates("seattle")
);

function getdailyQuakes() {
    $.ajax({ url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson" })
        .then(
            (response) => collectData(response.features, lastHourQuakes)
        );
}

function collectData(features, array) {
    for (let i = 0; i < features.length; i++) {
        const element = features[i];
        const place = element.properties.place;
        const coords = element.geometry.coordinates;
        const mag = element.properties.mag;
        const time = moment(element.properties.time).format("LLL");
        array.push({ place: place, coords: coords, mag: mag, time: time });
    }
    renderPastHourQuakes(array.slice(0, 5));
}

function renderPastHourQuakes(array) {
    for (let i = 0; i < array.length; i++) {
        $($("#latestQs").append(createQuakesInfo(array[i], i)));
    }
}

function createQuakesInfo(element, index) {
    return $("<p>")
        .attr("id", `latest-${index}`)
        .addClass("latest")
        .text(`Place: ${JSON.stringify(element.place)}, Magnitude: ${JSON.stringify(element.mag)}, Time: ${element.time}`);
}

function getCoordinates(array) {
    coords = [];
    for (let i = 0; i < array.length; i++) {
        coords.push(array[i].coords);
    }

    return coords;
}

function placeToCordinates(place) {
    const apiKey = '9bdca107dee44c8d90c4efabb9b500e4';
    $.ajax({ url: `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}` })
        .then(
            (response) => dataByLocation(response.results[0].geometry.lat, response.results[0].geometry.lng, quakesBySearch)
        );
}

function dataByLocation(lat, lon, array) {
    const radius = "100";
    const startTime = "2020-07-01";
    const endTime = "2020-07-27";
    $.ajax({ url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&longitude=${lon}&latitude=${lat}&maxradiuskm=${radius}` })
        .then(
            (response) => collectData(response.features, array)
        );
}

console.log(lastHourQuakes)
console.log(quakesBySearch)
