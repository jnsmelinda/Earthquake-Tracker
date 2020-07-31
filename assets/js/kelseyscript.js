// line 4-13: data is accessable for kelseyscript.js:
// 'event.detail' has the object array with the data and has to be passed to the function to be able to acces it.
// to get the coordinates: event.detail[index].coords, printDailyQuakes() and printQuakesBySearch() are only for display
document.addEventListener('dailyQuakes', printDailyQuakes, false);
document.addEventListener('quakesBySearch', printQuakesBySearch, false);

function printDailyQuakes(event) {
    console.log(event.detail);
}

function printQuakesBySearch(event) {
    console.log(event.detail);
}

var map;
var infowindow;
var apiKey = '9bdca107dee44c8d90c4efabb9b500e4';

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: new google.maps.LatLng(47.6062, -122.3321),
    mapTypeId: 'terrain'
  });
  infowindow = new google.maps.InfoWindow();
  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = `https://api.opencagedata.com/geocode/v1/json?q=${place}&key=${apiKey}`
  document.getElementsByTagName('head')[0].appendChild(script);
}


window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var text = '' + results.features[i].properties.place + '';
    var latLng = new google.maps.LatLng(coords[1], coords[0]);

    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });

    marker.addListener('click', (function(marker, text) {
      return function(e) {
        infowindow.setContent(text);
        infowindow.open(map, marker);
      }
    })(marker, text));
  }
}
