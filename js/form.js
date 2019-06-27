'use strict';
(function () {
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_WIDTH = 65;
  var PRICES = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var adForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var adInput = adForm.querySelectorAll('input');
  var map = document.querySelector('.map');
  var mapSelects = mapFiltersForm.querySelectorAll('select');
  var mapFieldsets = mapFiltersForm.querySelectorAll('fieldset');
  var address = adForm.querySelector('#address');
  var mainPin = document.querySelector(' .map__pin--main');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var defaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };


  // создание адреса

  var setAddress = function () {
    var pinX = parseInt(mainPin.style.left, 10) + Math.ceil(MAIN_PIN_WIDTH / 2);
    var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT);
    address.value = pinX + ', ' + pinY;
  };

  // связывание селектов

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

  // разблокировка формы

  var removeDisabledAttribute = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  };

  var getActivate = function () {
    removeDisabledAttribute(adFieldsets);
    removeDisabledAttribute(mapFieldsets);
    removeDisabledAttribute(mapSelects);
    adForm.classList.remove('ad-form--disabled');
    timeInSelect.addEventListener('click', onTimeSelectClick);
    timeOutSelect.addEventListener('click', onTimeSelectClick);
    typeSelect.addEventListener('click', onTypeSelectClick);
  };

  // блокирование формы

  var setDisabledAttribute = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = true;
    }
  };

  var getDisabled = function () {
    setDisabledAttribute(adFieldsets);
    setDisabledAttribute(mapFieldsets);
    setDisabledAttribute(mapSelects);
    timeInSelect.removeEventListener('click', onTimeSelectClick);
    timeOutSelect.removeEventListener('click', onTimeSelectClick);
    typeSelect.removeEventListener('click', onTypeSelectClick);
  };

  // очистка формы и карты

  var removeElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  };

  var onResetClick = function () {
    adForm.reset();
    mainPin.style.left = defaultCoords.x;
    mainPin.style.top = defaultCoords.y;
    setAddress();
    getDisabled();
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    removeElements(document.querySelectorAll('.pin'));
  };

  resetButton.addEventListener('click', onResetClick);

  var validate = function (field) {
    field.addEventListener('invalid', function () {
      field.style = 'border: 3px solid red';
    });
  };
  for (var i = 0; i < adInput.length; i++) {
    var input = adInput[i];
    validate(input);
  }

  window.form = {
    setAddress: setAddress,
    getActivate: getActivate,
    getDisabled: getDisabled
  };
})();
