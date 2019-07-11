'use strict';
(function () {


  var adForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var adInput = adForm.querySelectorAll('input');
  var mapSelects = mapFiltersForm.querySelectorAll('select');
  var mapFieldsets = mapFiltersForm.querySelectorAll('fieldset');
  var address = adForm.querySelector('#address');
  var mainPin = document.querySelector(' .map__pin--main');
  var priceInput = adForm.querySelector('#price');
  var typeSelect = adForm.querySelector('#type');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var roomsSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var capacity = capacitySelect.querySelectorAll('option');

  var RULES = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };


  // создание адреса

  var setAddress = function () {
    var pinX = parseInt(mainPin.style.left, 10) + Math.ceil(window.constants.MAIN_PIN_WIDTH / 2);
    var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(window.constants.MAIN_PIN_HEIGHT);
    address.value = pinX + ', ' + pinY;
  };
  setAddress();

  // связывание селектов

  var onTypeSelectClick = function (evt) {
    priceInput.placeholder = window.constants.PRICES[evt.target.value];
    priceInput.min = window.constants.PRICES[evt.target.value];
  };

  var onTimeSelectClick = function (evt) {
    if (evt.target.name === 'timein') {
      timeOutSelect.value = evt.target.value;
    } else {
      timeInSelect.value = evt.target.value;
    }
  };


  var onRoomsSelectChange = function () {
    var quantityGuests = RULES[roomsSelect.value];
    capacity.forEach(function (value) {
      value.disabled = quantityGuests.indexOf(value.value) === -1;
    });
  };
  var onCapacitySelectChange = function () {
    var quantityGuests = RULES[roomsSelect.value];
    if (quantityGuests.indexOf(capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Выберите другое количество мест');
    } else {
      capacitySelect.setCustomValidity('');
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
    roomsSelect.addEventListener('click', onRoomsSelectChange);
    capacitySelect.addEventListener('click', onCapacitySelectChange);
    typeSelect.addEventListener('click', onTypeSelectClick);
    resetButton.addEventListener('click', onResetClick);
    adForm.addEventListener('submit', onSubmitClick);
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
    adForm.classList.add('ad-form--disabled');
    resetButton.removeEventListener('click', onResetClick);
    adForm.removeEventListener('submit', onSubmitClick);
  };
  getDisabled();

  // очистка формы и карты

  var onResetClick = function () {
    adForm.reset();
    setAddress();
    getDisabled();
    window.map.deactivate();
  };

  var onSubmitClick = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), onLoad, window.map.onError);
  };

  var onLoad = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var success = successTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(success);
    adForm.reset();
    setAddress();
    getDisabled();
    window.map.deactivate();

    var onEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        onSuccessClick();
      }
    };

    var onSuccessClick = function () {
      main.removeChild(success);
      document.removeEventListener('click', onSuccessClick);
      document.removeEventListener('keydown', onEscPress);
    };

    document.addEventListener('click', onSuccessClick);
    document.addEventListener('keydown', onEscPress);
  };

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
