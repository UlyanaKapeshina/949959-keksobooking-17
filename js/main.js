'use strict';

var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;

var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsListElement = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var getRandomElement = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getAds = function (types, minX, maxX, minY, maxY) {
  var ads = [];
  for (var i = 0; i < 8; i++) {
    ads[i] = {
      author: {avatar: 'img/avatars/user0' + (i + 1) + '.png'},
      offer: {type: getRandomElement(types)},
      location: {x: getRandomInt(minX, maxX), y: getRandomInt(minY, maxY)}
    };
  }
  return ads;
};

var adsData = getAds(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y);

map.classList.remove('map--faded');

var renderPin = function (ad) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style = 'left:' + (ad.location.x - PIN_WIDTH / 2) + 'px; top:' + (ad.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.type;

  return pinElement;
};

var renderPins = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  pinsListElement.appendChild(fragment);
};

renderPins(adsData);
