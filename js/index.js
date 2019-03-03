const key = 'AIzaSyBniuWYvBmuSJq2_E_JE6ca1cIjLmt8X7s';
const placeURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
const proxyurl = 'https://cors-anywhere.herokuapp.com/';
let radius = 16000;
let type = 'restaurant';
let normalURL;
let fastFoodURL;
let searchURL;
let userURLCoordinates;

$(document).ready(function() {
  const message_element = $('#message');
  message_element.hide();
  getLocation();
  $('#fastFood').click(function() {
    $('#fastFood').toggleClass('active');
  });

  $('#foodbtn').click(function() {
    if ($('#fastFood').hasClass('active')) {
      searchURL = fastFoodURL;
    } else {
      searchURL = normalURL;
    }
    pickRestaurant();
    message_element.show();
  });
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getCoordinates);
  } else {
    $('#restaurant').text("Geolocation not supported by this browser");
  }
};

function getCoordinates(position) {
  getRestaurants(position.coords.latitude, position.coords.longitude);
  userURLCoordinates = `${position.coords.latitude}, ${position.coords.longitude}`
};

function getRestaurants(lat, long) {
  const params = [
    `location=${lat},${long}`,
    `radius=${radius}`,
    `type=${type}`,
    `key=${key}`,
  ].join('&');
  const textParams = [
    `location=${lat},${long}`,
    `radius=${radius}`,
    `key=${key}`,
  ].join('&');
  normalURL = `${placeURL}?${params}`;
  fastFoodURL = `${textURL}?query=fast+food&${textParams}`;
}

function randomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function pickRestaurant() {
  $.get(proxyurl + searchURL).then(function(result) {
    let food = result.results[randomIndex(20)];
    if(food.name == $('#restaurant').text()) {
      pickRestaurant();
    } else {
      $('#restaurant').text(`${food.name}`);
      let href = `https://www.google.com/maps/dir/?api=1&origin=${userURLCoordinates}&destination=${encodeURI(food.name)}`;
      $('a#directionsLink').attr('href', href);
      $('#directions').text('Directions');
    }
  });
};