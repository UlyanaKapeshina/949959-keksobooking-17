'use strict';

var ADS_QUANTITY = 8;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_WIDTH = 65;

var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsList = document.querySelector('.map__pins');
var map = document.querySelector('.map');

var getRandomElement = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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

var adsData = getAds(TYPES, MIN_X, MAX_X, MIN_Y, MAX_Y);

var renderPin = function (ad) {
  var pin = similarPinTemplate.cloneNode(true);
  pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
  pin.querySelector('img').src = ad.author.avatar;
  pin.querySelector('img').alt = ad.offer.typeSelect;

  return pin;
};

var renderPins = function (ads) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  pinsList.appendChild(fragment);
};


var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var adFieldsets = adForm.querySelectorAll('fieldset');
var mapSelects = mapFiltersForm.querySelectorAll('select');
var mapFieldsets = mapFiltersForm.querySelectorAll('fieldset');
var address = adForm.querySelector('#address');

var mainPin = document.querySelector(' .map__pin--main');

var setDisabledAttribute = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = true;
  }
};

setDisabledAttribute(adFieldsets);
setDisabledAttribute(mapFieldsets);
setDisabledAttribute(mapSelects);

var removeDisabledAttribute = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
};

var setAddress = function () {
  var pinX = parseInt(mainPin.style.left, 10) + Math.ceil(MAIN_PIN_WIDTH / 2);
  var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT / 2);
  address.value = pinX + ', ' + pinY;
};
setAddress();

var onPinClick = function () {
  removeDisabledAttribute(adFieldsets);
  removeDisabledAttribute(mapFieldsets);
  removeDisabledAttribute(mapSelects);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mainPin.removeEventListener('click', onPinClick);
  renderPins(adsData);
  setAddress();
};

mainPin.addEventListener('click', onPinClick);

var priceInput = adForm.querySelector('#price');
var typeSelect = adForm.querySelector('#type');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var onTypeSelectClick = function (evt) {
  if (evt.target.value === 'bungalo') {
    priceInput.placeholder = '0';
    priceInput.min = '0';
  }
  if (evt.target.value === 'flat') {
    priceInput.placeholder = '1000';
    priceInput.min = '1000';
  }
  if (evt.target.value === 'house') {
    priceInput.placeholder = '5000';
    priceInput.min = '5000';
  }
  if (evt.target.value === 'palace') {
    priceInput.placeholder = '10000';
    priceInput.min = '10000';
  }
};

var onTimeSelectClick = function (evt) {
  timeOutSelect.value = evt.target.value;
};

timeInSelect.addEventListener('click', onTimeSelectClick);
typeSelect.addEventListener('click', onTypeSelectClick);
