import { locateAndCreateMarkerEvent } from './map_marker.js';
import {Google_API_Key} from './api_keys.js';

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');

script.src = "https://maps.googleapis.com/maps/api/js?key="+Google_API_Key+"&callback=initMap";
script.async = true;


// These variables should eventually be fetched from a database? If we're going for that functionality.
let map_object;

window.initMap = function() {
  
  map_object = new google.maps.Map(document.getElementById('map'), {
    // Keep in MIND:
    // N and E coordinates are positive values
    // W and S coordinates are negative values

    // Washington, D.C. Coordinates
    center: {lat: 38.889248, lng: -77.050636}, 
    zoom: 8
  });

  console.log(map_object);
  const geocoder = new google.maps.Geocoder();

  // Event Listener, when we click "submit" button we call the function geocodeAddress();
  document.getElementById("submit").addEventListener("click", (e) => {
    geocodeAddress(geocoder, map_object);
  });

};

// This method takes in Geocoder object, and Google Maps object
function geocodeAddress(geocoder, googleMaps) {

    // acquiring "text" value of whatever we inputted in the input field.
    const address = document.getElementById("target_address").value;
    geocoder.geocode({ address: address }, (results, status) => {

      // If status is OK... pinpoint marker location and add to User Array.
      if (status === "OK") {
        // googleMaps.setCenter(results[0].geometry.location);
        locateAndCreateMarkerEvent(googleMaps, results)

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);