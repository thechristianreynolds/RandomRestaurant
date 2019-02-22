const key = 'AIzaSyBuTc_usOwrWL6eT2EjsuAhQ40VCVGdXuM';
const placeURL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const textURL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
let fastURL;
const proxyurl = 'https://cors-anywhere.herokuapp.com/';
const geoURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + key;
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
    $.get(proxyurl + theURL).then(function(result) {
      food = result.results[randomIndex(20)];
      $('#restaurant').text(`${food.name}`);
      message_element.show();
      let href = `https://www.google.com/maps/dir/?api=1&origin=${place_coord}&destination=${encodeURI(food.name)}`;
      $('a#directionsLink').attr('href', href);
      $('#directions').text('Directions');
    });
  });
});

function getLocation() {
  $.post(geoURL).then(function(result) {
    getResults(result.location.lat, result.location.lng);
  });
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