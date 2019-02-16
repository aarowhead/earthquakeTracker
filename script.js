var map = null;
var markers = [];

function initMap() {
  map = new google.maps.Map(
    document.getElementById('map'), {
      center: new google.maps.LatLng(0, 0),
      zoom: 1,
      minZoom: 1
    });
}

$(document).ready(function() {
  var start_date_input = $('input[id="startDate"]'); //our date input has the name "date"
  var end_date_input = $('input[id="endDate"]');
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  var options = {
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  };
  start_date_input.datepicker(options);
  end_date_input.datepicker(options);
})

function stringToCallString(str) {
  var date = str.split("/"),
    m = date[0],
    d = date[1],
    y = date[2];
  return y + "-" + m + "-" + d;
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

document.getElementById("submitButton").addEventListener("click", function(event) {
  event.preventDefault();
  clearMarkers();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const minmagnitude = document.getElementById("magnitudeSelect").value;
  const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + stringToCallString(startDate) + "&endtime=" + stringToCallString(endDate) + "&minmagnitude=" + minmagnitude;
  fetch(url)
    .then(function(response) {
      return response.json();
    }).then(function(json) {
      for (let i = 0; i < json.features.length; i++) {
        let earthquake = json.features[i];
        let infoWindow = new google.maps.InfoWindow({
          content: "<p>" + json.features[i].properties.title + "</p>"
        })
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]),
          map: map
        });
        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        })
        markers.push(marker);
      }
    })
})