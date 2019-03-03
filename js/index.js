const key = 'AIzaSyBniuWYvBmuSJq2_E_JE6ca1cIjLmt8X7s';
const placeURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
let fastURL;
const proxyurl = 'https://cors-anywhere.herokuapp.com/';
let searchURL;
let radius = 16000;
let type = 'restaurant';
let theURL;
let place_coord;


$(document).ready(function() {
  const message_element = $('#message');
  message_element.hide();
  getLocation();
  theURL = searchURL;
  $('#fastFood').click(function() {
    $('#fastFood').toggleClass('active');
  });

  $('#foodbtn').click(function() {
    if ($('#fastFood').hasClass('active')) {
      theURL = fastURL;
    } else {
      theURL = searchURL;
    }
    findFood();
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
  getResults(position.coords.latitude, position.coords.longitude);
};

function getResults(lat, long) {
  place_coord = `${lat},${long}`;
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
  const url = `${placeURL}?${params}`;
  fastURL = `${textURL}?query=fast+food&${textParams}`;
  searchURL = url;
}

function randomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function findFood() {
  $.get(proxyurl + theURL).then(function(result) {
    let food = result.results[randomIndex(20)];
    if(food.name == $('#restaurant').text()) {
      findFood();
    } else {
      $('#restaurant').text(`${food.name}`);
      let href = `https://www.google.com/maps/dir/?api=1&origin=${place_coord}&destination=${encodeURI(food.name)}`;
      $('a#directionsLink').attr('href', href);
      $('#directions').text('Directions');
    }
  });
};