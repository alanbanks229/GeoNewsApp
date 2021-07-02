import { locateAndCreateAllMarkerEvents } from './map_marker.js';
import {Google_API_Key} from './api_keys.js';

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');

script.src = "https://maps.googleapis.com/maps/api/js?key="+Google_API_Key+"&callback=initMap&libraries=places";
script.async = true;

// These variables should eventually be fetched from a database? If we're going for that functionality.
let map_object;

//Regex for obtaining float values from strings
const float_regex = /[+-]?\d+(\.\d+)?/g;

// GooglePlacesObject
let autocomplete;

window.initMap = function() {

  let num_of_bookmarks = window.USER_BOOKMARKS.length;
  if (num_of_bookmarks > 0 ){
    map_object = returnAndCenterMapToLatestLocation()
    locateAndCreateAllMarkerEvents(window.USER_BOOKMARKS, map_object, float_regex)
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
  document.getElementById("pseudo_submit").addEventListener("click", (e) => {
    const address = document.getElementById("target_address").value;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        let target_coordinates = results[0].geometry.location;
        // Adding this to a hidden element on HTML
        document.getElementById("target_coords").value = target_coordinates;
        document.getElementById("address_form").submit();
      } else {
        alert("Address Provided is not valid: " + status);
      }
    });
  });

  // Prevents a user to submit the form accidently while clicking enter when
  // choosing a auto-filled address.
  // I think this is fine from a UI standpoint lemme know your thoughts --Alan
  // 
  let input_field = document.getElementById("target_address");
  input_field.addEventListener("keydown", (e) => {
    if (e.key === "Enter"){
      e.preventDefault();
      //Prevents form to submit when user clicks enter within input field
    }
  })

  let bookmark_checkbox = document.getElementById("bookmark_checkbox_listener");
  let bookmark_form = document.getElementById("Bookmarks_SideBar");
  bookmark_checkbox.addEventListener("change", (e) => {
    console.log(bookmark_checkbox.checked)
    //"this" is referring to the bookmark_checkbox html element ... not the javascript window.init
    if (bookmark_checkbox.checked){
      bookmark_checkbox.disabled = true;
      setTimeout(function(){bookmark_checkbox.disabled = false;},1000);
      document.getElementById("show_bookmark_label").innerHTML = "Hide Bookmarks"
      bookmark_form.className = 'sidebarVisible';
      bookmark_form.style.display = 'block';
    } else {
      // setTimeout(function(){bookmark_checkbox.disabled = false;},1000);
      document.getElementById("show_bookmark_label").innerHTML = "Show Bookmarks"
      bookmark_form.className = 'sidebarHidden';
      bookmark_form.style.display = 'none';
    }
  })


};


function setup_autocomplete(){
  const input = document.getElementById("target_address");
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    origin: map_object.getCenter(),
    strictBounds: false,
    types: ["geocode"],
  };
  // Below input is the DOM element wherever the text box you are using is
  autocomplete = new google.maps.places.Autocomplete(input, options);
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
    // marker.setVisible(false);
    let place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent = place.formatted_address;
    infowindow.open(map_object, marker);
    
    // We could potentially use the below later if we want to add a function where a user
    // can click on their bookmarks and the maps object will redirect the user to that marker.
    
    //**** */ If the place has a geometry, then present it on a map.
    // if (place.geometry.viewport) {
    //   map_object.fitBounds(place.geometry.viewport);
    // } else {
    //   map_object.setCenter(place.geometry.location);
    //   map_object.setZoom(17);
    // }
    // marker.setPosition(place.geometry.location);
    // marker.setVisible(true);
  });
}

// returns a google maps object which is centered based upon the last inputted address.
// This should be adjusted to consider if the last address inputted was already inside the user's database.
function returnAndCenterMapToLatestLocation(){
  let str_arr_of_bookmarks = window.USER_BOOKMARKS
  let last_saved_coords = str_arr_of_bookmarks[str_arr_of_bookmarks.length - 1];
  var floats = last_saved_coords.match(float_regex).map(function(v) {return parseFloat(v); });

  let mapObject = new google.maps.Map(document.getElementById('map'), {
    center: 
    {
      lat: floats[0],
      lng: floats[1]
    },
    zoom: 8
  })
  return mapObject;
}

// Append the 'script' element to 'head'
document.head.appendChild(script);