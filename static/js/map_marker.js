// Helper File containing methods pertaining to Google Map Markers.

import { fetchNews } from './BingNewsFetch.js';

document.getElementById("clearMarkers").addEventListener('click', (e) => {
    clearMarkers();
})
document.getElementById("showMarkers").addEventListener('click', (e) => {
    showMarkers();
})
// document.getElementById("deleteMarkers").addEventListener('click', (e) => {
//     deleteMarkers();
// })

// Code below is taken/inspired from:
// https://developers.google.com/maps/documentation/javascript/examples/marker-remove#maps_marker_remove-javascript

let mapObject;
let markers = [];

function locateAndCreateAllMarkerEvents(arr_of_bookmarks_to_s){

  let last_saved_coords = window.USER_BOOKMARKS[arr_of_bookmarks_to_s.length - 1];
  var regex = /[+-]?\d+(\.\d+)?/g;
  var floats = last_saved_coords.match(regex).map(function(v) {return parseFloat(v); });

  mapObject = new google.maps.Map(document.getElementById('map'), {
    center: 
    {
      lat: floats[0],
      lng: floats[1]
    },
    zoom: 8
  })

  // creating all markers
  let counter = arr_of_bookmarks_to_s.length - 1
  let collection_of_addresses = document.getElementsByClassName("addresses");
  while(counter >= 0){
    let current_coords_string = arr_of_bookmarks_to_s[counter]
    let coords = current_coords_string.match(regex).map(function(v) {return parseFloat(v); });
    let marker = new google.maps.Marker({
      position: {lat: coords[0], lng: coords[1]},
      map: mapObject
    })
    console.log("current counter -->", counter)
    markers.push(marker);
    let current_address = collection_of_addresses[counter].innerText
    marker.addListener("click", (e) => {
      fetchNews(current_address)
    })
    counter = counter - 1;
  }

}

/* DEPRECATED METHOD BELOW  */
// Adds a marker to the map and push to the array.
// In addition, adds an event listener for each marker to acquire news on click.
// function locateAndCreateMarkerEvent(googleMapsObj, geocodeResult) {
//     map = googleMapsObj;
//     let target_coordinates = geocodeResult[0].geometry.location;
//     let target_address = geocodeResult[0].formatted_address;
//     googleMapsObj.setCenter(target_coordinates);

//     let address = document.getElementById("target_address").value;

//     const marker = new google.maps.Marker({
//       position: target_coordinates,
//       map: googleMapsObj,
//     });
//     marker.addListener("click", (e) => {
//         fetchNews(target_address)
//     })
//     markers.push(marker);

//     document.getElementById("target_coords").value = target_coordinates;
//   }
  
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
    setMapOnAll(mapObject);
  }
  
  // Deletes all markers in the array by removing references to them.
  // function deleteMarkers() {
  //   clearMarkers();
  //   markers = [];
  // }

  export {locateAndCreateAllMarkerEvents}