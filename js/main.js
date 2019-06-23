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

var PRICES = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'
};


var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsList = document.querySelector('.map__pins');
var map = document.querySelector('.map');


var renderPin = function (ad) {
  var pin = similarPinTemplate.cloneNode(true);
  pin.classList.add('pin');
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

var removeElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].remove();
  }
};

var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var adFieldsets = adForm.querySelectorAll('fieldset');

var mapSelects = mapFiltersForm.querySelectorAll('select');
var mapFieldsets = mapFiltersForm.querySelectorAll('fieldset');
var address = adForm.querySelector('#address');

var mainPin = document.querySelector(' .map__pin--main');


var resetButton = adForm.querySelector('.ad-form__reset');

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
  var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT);
  address.value = pinX + ', ' + pinY;
};
setAddress();

var activateMap = function () {
  removeDisabledAttribute(adFieldsets);
  removeDisabledAttribute(mapFieldsets);
  removeDisabledAttribute(mapSelects);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mainPin.removeEventListener('click', activateMap);
  renderPins(window.data);
  timeInSelect.addEventListener('click', onTimeSelectClick);
  timeOutSelect.addEventListener('click', onTimeSelectClick);
  typeSelect.addEventListener('click', onTypeSelectClick);
};

var onResetClick = function () {
  timeInSelect.removeEventListener('click', onTimeSelectClick);
  timeOutSelect.removeEventListener('click', onTimeSelectClick);
  typeSelect.removeEventListener('click', onTypeSelectClick);
  adForm.reset();
  mainPin.style.left = defaultCoords.x;
  mainPin.style.top = defaultCoords.y;
  setAddress();
  setDisabledAttribute(adFieldsets);
  setDisabledAttribute(mapFieldsets);
  setDisabledAttribute(mapSelects);

  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  removeElements(document.querySelectorAll('.pin'));

};

resetButton.addEventListener('click', onResetClick);

var priceInput = adForm.querySelector('#price');
var typeSelect = adForm.querySelector('#type');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var onTypeSelectClick = function (evt) {
  priceInput.placeholder = PRICES[evt.target.value];
  priceInput.min = PRICES[evt.target.value];
};

var onTimeSelectClick = function (evt) {
  if (evt.target.name === 'timein') {
    timeOutSelect.value = evt.target.value;
  } else {
    timeInSelect.value = evt.target.value;
  }
};

var defaultCoords = {
  x: mainPin.style.left,
  y: mainPin.style.top
};

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    setAddress();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var mainPinY = mainPin.offsetTop - shift.y;
    var mainPinX = mainPin.offsetLeft - shift.x;

    if (mainPinY < MAX_Y && mainPinY > MIN_Y - MAIN_PIN_HEIGHT) {
      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
    }
    if (mainPinX < (MAX_X - MAIN_PIN_WIDTH) && mainPinX > MIN_X) {
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    activateMap();
    setAddress();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


