// Create the script tag, set the appropriate attributes
var script = document.createElement('script');

var api_key = 'AIzaSyA8sAL9r1Q6e4evB1ixFTTNSZEa7UpjcT0'
script.src = "https://maps.googleapis.com/maps/api/js?key="+api_key+"&callback=initMap";
script.async = true;

//I believe this just runs when the window/browser loads?
window.initMap = function() {
  
  //Created Google Maps object
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644}, 
    zoom: 8
  });

  //Created geocoder object
  const geocoder = new google.maps.Geocoder();

  // Event Listener, when we click "submit" button we call the function geocodeAddress();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });

};

// This method takes in Geocoder object, and Google Maps object
function geocodeAddress(geocoder, googleMaps) {

    // acquiring "text" value of whatever we inputted in the input field.
    const address = document.getElementById("address").value;
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        googleMaps.setCenter(results[0].geometry.location);

        // create new marker at location
        new google.maps.Marker({
          map: googleMaps,
          position: results[0].geometry.location,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);