'use strict';

var ADS_QUANTITY = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var getRandomElement = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// создание массива объявлений

var getAds = function (types, minX, maxX, minY, maxY) {
  var ads = [];
  for (var i = 0; i < ADS_QUANTITY; i++) {
    ads[i] = {
      author: {avatar: 'img/avatars/user0' + (i + 1) + '.png'},
      offer: {typeSelect: getRandomElement(types)},
      location: {x: getRandomInt(minX, maxX), y: getRandomInt(minY, maxY)}
    };
  }
  return ads;
};

window.data = {
  getAds: getAds(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y)
};


