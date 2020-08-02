$(document).ready(getdailyQuakes);
document.addEventListener('dailyQuakes', renderPastHourQuakes, false);
document.addEventListener('quakesBySearch', renderQuakesBySearch, false);

$('#search').on('click', function(event) {
    event.preventDefault();
    const location = $('#location').val().trim();
    const startDate = $('#startDate').val().trim();
    const endDate = $('#endDate').val().trim();
    const radius = $('#radius').val().trim();
    placeToCordinates(location, startDate, endDate, radius);
});

function getdailyQuakes() {
    $.ajax({url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'})
        .then(
            function(response) {
                const lastHourQuakes = collectData(response.features);
                const event = new CustomEvent('dailyQuakes', {detail: lastHourQuakes});
                document.dispatchEvent(event);
            },
            (response, status) => errorHandlingOfLatestQuakes(response, status)
        );
}

function errorHandlingOfLatestQuakes(response, status) {
    console.log(`Request failed. Returned status: ${status}, response: ${JSON.stringify(response)}`);
    $('#errorOfLatestQuakes').html('Sorry, no results for that search.');
}

function collectData(features) {
    const quakes = [];

    if (features.length === 0) {
        $('#searchErrors').text('Sorry, no quakes for this search.');
    }

    for (let i = 0; i < features.length; i++) {
        const element = features[i];
        const place = element.properties.place;
        const coords = element.geometry.coordinates;
        const mag = element.properties.mag;
        const time = moment(element.properties.time).format('LLL');
        quakes.push({place: place, coords: coords, mag: mag, time: time});
    }

    return quakes;
}

function renderQuakesBySearch(event) {
    const quakes = event.detail;
    for (let i = 0; i < quakes.length; i++) {
        $('#searchResults').append(createQuakesInfo(quakes[i], i, 'searchQuakesResult', 'resultelement'));
    }
}

function renderPastHourQuakes(event) {
    const quakes = event.detail.slice(0, 5);
    for (let i = 0; i < quakes.length; i++) {
        $($('#latestQs')
            .append(createQuakesInfo(quakes[i], i, 'latestQs', 'latest')));
    }
}

function createQuakesInfo(element, index, id, classe) {
    return $('<p>')
        .attr('id', `${id}-${index}`)
        .addClass(classe)
        .append(createDataPoint('Location', element.place))
        .append(createDataPoint('Magnitude', element.mag.toFixed(2)))
        .append(createDataPoint('Time', element.time));
}

function createDataPoint(label, value) {
    return $('<span>')
        .addClass('dataPoint')
        .append(createLabel(label))
        .append(': ')
        .append(value)
        .append(' ');
}

function createLabel(labelText) {
    return $('<span>')
        .addClass('dataLabel')
        .text(labelText);
}

function placeToCordinates(place, startDate, endDate, radius) {
    const apiKey = '9bdca107dee44c8d90c4efabb9b500e4';

    $('#searchResults').html('');
    $('#searchErrors').html('');
    $.ajax({url: `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}`})
        .then(
            (response) => handleCoordinates(response, startDate, endDate, radius),
            (response, status) => errorHandlingOfCoordinates(response, status)
        );
}

function handleCoordinates(response, startDate, endDate, radius) {
    if (response.results.length === 0) {
        $('#searchErrors').text('Sorry, no location has been found.');
    }

    return dataByLocation(
        response.results[0].geometry.lat,
        response.results[0].geometry.lng,
        radius,
        startDate,
        endDate
    );
}

function errorHandlingOfCoordinates(response, status) {
    console.log(`Request failed. Returned status: ${status}, response: ${JSON.stringify(response)}`);
    $('#searchErrors').text('Unable to search for quakes');
}

function dataByLocation(lat, lon, radius, startDate, endDate) {
    $.ajax({url: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&longitude=${lon}&latitude=${lat}&maxradiuskm=${radius}`})
        .then(
            function(response) {
                const quakesBySearch = collectData(response.features);
                const event = new CustomEvent('quakesBySearch', {detail: quakesBySearch});
                document.dispatchEvent(event);
            },
            (response, status) => errorHandlingOfQuery(response, status)
        );
}

function errorHandlingOfQuery(response, status) {
    console.log(`Request failed. Returned status: ${status}, response: ${JSON.stringify(response)}`);
    $($('#searchResults')
        .prepend($('<div>')
            .text('Sorry, no results for that search. Please click on Start Over and try again.')));
}
