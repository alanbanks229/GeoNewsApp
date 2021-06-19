import { locateAndCreateAllMarkerEvents } from './map_marker.js';
import {Google_API_Key} from './api_keys.js';

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');

script.src = "https://maps.googleapis.com/maps/api/js?key="+Google_API_Key+"&callback=initMap";
script.async = true;

// These variables should eventually be fetched from a database? If we're going for that functionality.
let map_object;

window.initMap = function() {
  let num_of_bookmarks = window.USER_BOOKMARKS.length;
  if (num_of_bookmarks > 0 ){
    locateAndCreateAllMarkerEvents(window.USER_BOOKMARKS)
  } else {
    map_object = new google.maps.Map(document.getElementById('map'), {
      // Keep in MIND:
      // N and E coordinates are positive values
      // W and S coordinates are negative values
  
      // Washington, D.C. Coordinates
      center: {lat: 38.889248, lng: -77.050636}, 
      zoom: 8
    });

  }

  const geocoder = new google.maps.Geocoder();

  
  // THIS IS ESSENTIALLY A PRE-CHECK TO SEE IF THE PROVIDED ADDRESS
  // CAN PROPERLY BE APPLIED TO THE GOOGLE MAPS API, and create a marker.
  document.getElementById("submit").addEventListener("mouseover", (e) => {
    const address = document.getElementById("target_address").value;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
<<<<<<< HEAD
=======
         map_object.setCenter(results[0].geometry.location);
         locateAndCreateMarkerEvent(map_object, results);

>>>>>>> master
        let target_coordinates = results[0].geometry.location;
        // Adding this to a hidden element on HTML
        document.getElementById("target_coords").value = target_coordinates;
<<<<<<< HEAD
=======
        document.getElementById("target_address").value = target_address;
        

>>>>>>> master
      } else {
        alert("Address Provided is not valid: " + status);
      }
    });
  });

};

// *** DEPRECATED ****
// This method takes in Geocoder object, and Google Maps object
// function geocodeAddress(geocoder, googleMaps) {

//     // acquiring "text" value of whatever we inputted in the input field.
//     const address = document.getElementById("target_address").value;
//     geocoder.geocode({ address: address }, (results, status) => {

//       // If status is OK... pinpoint marker location and add to User Array.
//       if (status === "OK") {
//         // googleMaps.setCenter(results[0].geometry.location);
//         locateAndCreateMarkerEvent(googleMaps, results)

//       } else {

//         alert("Geocode was not successful for the following reason: " + status);
//       }
//     });
// }

// Append the 'script' element to 'head'
document.head.appendChild(script);