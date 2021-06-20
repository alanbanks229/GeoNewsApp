import { locateAndCreateAllMarkerEvents } from './map_marker.js';
import {Google_API_Key} from './api_keys.js';

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');

script.src = "https://maps.googleapis.com/maps/api/js?key="+Google_API_Key+"&callback=initMap&libraries=places";
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

  //helper method
  setup_autocomplete();

  const geocoder = new google.maps.Geocoder();

  
  // THIS IS ESSENTIALLY A PRE-CHECK TO SEE IF THE PROVIDED ADDRESS
  // CAN PROPERLY BE APPLIED TO THE GOOGLE MAPS API, and create a marker.
  document.getElementById("submit").addEventListener("mouseover", (e) => {
    const address = document.getElementById("target_address").value;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        let target_coordinates = results[0].geometry.location;
        // Adding this to a hidden element on HTML
        document.getElementById("target_coords").value = target_coordinates;
      } else {
        alert("Address Provided is not valid: " + status);
      }
    });
  });

};


function setup_autocomplete(){
  // const card = document.getElementById("pac-card");
  const input = document.getElementById("target_address");
  // const biasInputElement = document.getElementById("use-location-bias");
  // const strictBoundsInputElement = document.getElementById("use-strict-bounds");
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    origin: map_object.getCenter(),
    strictBounds: false,
    types: ["establishment"],
  };
  // Below input is the DOM element wherever the text box you are using is
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.setTypes(["geocode"]) //Set this to Geocode places...
  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map_object);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  const marker = new google.maps.Marker({
    map_object,
    anchorPoint: new google.maps.Point(0, -29),
  });
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    const place = autocomplete.getPlace();
    
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map_object.fitBounds(place.geometry.viewport);
    } else {
      map_object.setCenter(place.geometry.location);
      map_object.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
    place.formatted_address;
    infowindow.open(map_object, marker);
  });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);