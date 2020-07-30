var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        //defaults to Seattle as the center
        center: new google.maps.LatLng(47.6062, -122.3321),
        mapTypeId: 'terrain'
    });


    var script = document.createElement('script');
    //placeholder for actual earthquake link
    script.src = `http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp`;
    document.getElementsByTagName('header')[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
// need to get coordinates from Melinda
window.eqfeed_callback = function (results) {
    for (var i = 0; i < results.features.length; i++) {
        var coords = results.features[i].geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
    }
}
