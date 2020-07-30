let lastHourQuakes = [];
let quakesBySearch = [];

$(document).ready(
    getdailyQuakes()
);

$("#search").on("click", function (event) {
    event.preventDefault();
    const location = $("#location").val().trim();
    const startDate = $("#startDate").val().trim();
    const endDate = $("#endDate").val().trim();
    const radius = $("#radius").val().trim();
    placeToCordinates(location, startDate, endDate, radius);
});

function getdailyQuakes() {
    $.ajax({ url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson" })
        .then(function (response) {
            lastHourQuakes = collectData(response.features, lastHourQuakes),
                renderPastHourQuakes(lastHourQuakes.slice(0, 5))
        });
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

    return array;
}

function renderQuakesBySearch(array) {
    for (let i = 0; i < array.length; i++) {
        $($("#queryResults").append(createQuakesInfo(array[i], i, "searchQuakesResult", "resultelement")));
    }
}

function renderPastHourQuakes(array) {
    for (let i = 0; i < array.length; i++) {
        $($("#latestQs").append(createQuakesInfo(array[i], i, "latestQs", "latestPlace")));
    }
}

function createQuakesInfo(element, index, id, classe) {
    return $("<p>")
        .attr("id", `${id}-${index}`)
        .addClass(classe)
        .text(`Place: ${JSON.stringify(element.place)}, Magnitude: ${JSON.stringify(element.mag)}, Time: ${element.time}`);
}

function getCoordinates(array) {
    coords = [];
    for (let i = 0; i < array.length; i++) {
        coords.push(array[i].coords);
    }

    return coords;
}

function placeToCordinates(place, startDate, endDate, radius) {
    const apiKey = '9bdca107dee44c8d90c4efabb9b500e4';
    $.ajax({ url: `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}` })
        .then(
            (response) => dataByLocation(response.results[0].geometry.lat, response.results[0].geometry.lng, quakesBySearch, startDate, endDate, radius)
        );
}

function dataByLocation(lat, lon, array, startDate, endDate, radius) {
    $.ajax({ url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&longitude=${lon}&latitude=${lat}&maxradiuskm=${radius}` })
        .then(function (response) {
            quakesBySearch = collectData(response.features, array),
                renderQuakesBySearch(quakesBySearch)
        });
}
