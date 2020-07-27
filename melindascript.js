const quakes = [];

$(document).ready(
    getdailyQuakes()
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
        quakes.push({place: place, coords: coords, mag: mag, time: time});
    }
    console.log(quakes);
}
