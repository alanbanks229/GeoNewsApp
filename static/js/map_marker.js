// Helper File containing methods pertaining to Google Map Markers.

import { fetchNews } from './BingNewsFetch.js';

document.getElementById("clearMarkers").addEventListener('click', (e) => {
    clearMarkers();
})
document.getElementById("showMarkers").addEventListener('click', (e) => {
    showMarkers();
})
document.getElementById("deleteMarkers").addEventListener('click', (e) => {
    deleteMarkers();
})

// Code below is taken/inspired from:
// https://developers.google.com/maps/documentation/javascript/examples/marker-remove#maps_marker_remove-javascript

let map;
let markers = [];

// Adds a marker to the map and push to the array.
// In addition, adds an event listener for each marker to acquire news on click.
function locateAndCreateMarkerEvent(googleMapsObj, geocodeResult) {
    map = googleMapsObj;
    let target_coordinates = geocodeResult[0].geometry.location;
    let target_address = geocodeResult[0].formatted_address;
    googleMapsObj.setCenter(target_coordinates);

    let address = document.getElementById("target_address").value;

    const marker = new google.maps.Marker({
      position: target_coordinates,
      map: googleMapsObj,
    });
    marker.addListener("click", (e) => {
        fetchNews(target_address)
    })
    markers.push(marker);
    const token = document.getElementById("csrf_token").value
    // This will need to be a database call eventually... updating a user's marker array...
    // const request = new Request(
    //   window.location.href,
    //   {headers: {'X-CSRFToken': window.CSRF_TOKEN}}
    // )
    // debugger
    let data = {
      'address': address,
      'coords': target_coordinates
    }
    console.log(data)
    fetch(window.location.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.CSRF_TOKEN
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('SUCCESS: ', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    })
  }
  
  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  
  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }
  
  // Shows any markers currently in the array.
  function showMarkers() {
    setMapOnAll(map);
  }
  
  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  export {locateAndCreateMarkerEvent}