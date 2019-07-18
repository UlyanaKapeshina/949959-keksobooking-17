'use strict';
(function () {

  var RULES = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var PRICES = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_WIDTH = 65;
  var adForm = document.querySelector('.ad-form');
  var fieldsetsAndSelects = document.querySelectorAll('select, fieldset');
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
  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview').querySelector('img');
  var photoChooser = document.querySelector('#images');
  var container = document.querySelector('.ad-form__photo-container');
  var div = document.querySelector('.ad-form__photo');
  var defaultAvatar = avatarPreview.src;
  var dropboxAvatar = document.querySelector('.ad-form-header__drop-zone');
  var dropboxPhotos = document.querySelector('.ad-form__drop-zone');
  var main = document.querySelector('main');

  // создание адреса метки в поле формы

  var setAddress = function () {
    var pinX = parseInt(mainPin.style.left, 10) + Math.ceil(MAIN_PIN_WIDTH / 2);
    var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT);
    address.value = pinX + ', ' + pinY;
  };
  setAddress();

  // связывание селектов
  // синхронизация типа жилья и стоимости

  var setMinPrice = function (type) {
    priceInput.placeholder = PRICES[type];
    priceInput.min = PRICES[type];
  };
  var onTypeSelectChange = function () {
    setMinPrice(typeSelect.value);
  };

  // синхронизация времени заезда и выезда

  var onTimeSelectChange = function (evt) {
    if (evt.target.name === 'timein') {
      timeOutSelect.value = evt.target.value;
    } else {
      timeInSelect.value = evt.target.value;
    }
  };

  // синхронизация количества комнат и гостей

  var onRoomsSelectClick = function () {
    var guestsQuantities = RULES[roomsSelect.value];
    capacity.forEach(function (value) {
      value.disabled = guestsQuantities.indexOf(value.value) === -1;
    });
  };
  var onCapacitySelectClick = function () {
    var quantityGuests = RULES[roomsSelect.value];
    if (quantityGuests.indexOf(capacitySelect.value) === -1) {
      capacitySelect.setCustomValidity('Выберите другое количество мест');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  // загрузка фотографий при нажатии

  var onPhotoChange = function (evt) {
    var input = evt.currentTarget;
    if (input.multiple) {
      window.drop.processInputMultiple(input.files);
    } else {
      window.drop.processInputOne(input.files);
    }
  };

  // обработка одной фотографии для превью

  window.drop.processInputOne = function (files) {
    window.preview.image(files[0], avatarPreview);
  };

  // обработка пачки фотографий для превью

  window.drop.processInputMultiple = function (files) {
    Array.from(files).forEach(function (file) {
      window.preview.image(file, window.preview.render(container, div));
    });
  };

  // разблокировка селектов

  var removeDisabledAttribute = function (elements) {
    elements.forEach(function (element) {
      element.disabled = false;
    });
  };

  // активация формы

  var getActivate = function () {
    removeDisabledAttribute(fieldsetsAndSelects);
    adForm.classList.remove('ad-form--disabled');
    timeInSelect.addEventListener('change', onTimeSelectChange);
    timeOutSelect.addEventListener('change', onTimeSelectChange);
    avatarChooser.addEventListener('change', onPhotoChange);
    photoChooser.addEventListener('change', onPhotoChange);
    onRoomsSelectClick();
    onCapacitySelectClick();
    roomsSelect.addEventListener('click', onRoomsSelectClick);
    capacitySelect.addEventListener('click', onCapacitySelectClick);
    typeSelect.addEventListener('change', onTypeSelectChange);
    resetButton.addEventListener('click', onResetFormClick);
    adForm.addEventListener('submit', onSubmitButtonClick);
    window.drop.getActivate(dropboxAvatar);
    window.drop.getActivate(dropboxPhotos);
  };

  // блокирование селектов

  var setDisabledAttribute = function (elements) {
    elements.forEach(function (element) {
      element.disabled = true;
    });
  };

  // блокирование формы

  var getDisabled = function () {
    setMinPrice(typeSelect.value);
    setDisabledAttribute(fieldsetsAndSelects);
    timeInSelect.removeEventListener('change', onTimeSelectChange);
    timeOutSelect.removeEventListener('change', onTimeSelectChange);
    avatarChooser.removeEventListener('change', onPhotoChange);
    photoChooser.removeEventListener('change', onPhotoChange);
    typeSelect.removeEventListener('change', onTypeSelectChange);
    adForm.classList.add('ad-form--disabled');
    resetButton.removeEventListener('click', onResetFormClick);
    adForm.removeEventListener('submit', onSubmitButtonClick);
    avatarPreview.src = defaultAvatar;
    window.drop.getDeactivate(dropboxAvatar);
    window.drop.getDeactivate(dropboxPhotos);
    container.querySelectorAll('.ad-form__photo').forEach(function (element) {
      element.remove();
    });
  };

  // блокирование формы при открытии страницы
  getDisabled();

  // очистка формы и карты по кнопке reset

  var onResetFormClick = function () {
    adForm.reset();
    getDisabled();
    window.map.deactivate();
  };

  // отправка формы объявления

  var onSubmitButtonClick = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), onLoad, window.message.onErrorForm);
  };

  // сообщение об успешной отправке формы объявления

  var onLoad = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var success = successTemplate.cloneNode(true);
    main.appendChild(success);
    window.map.deactivate();
    adForm.reset();
    setAddress();
    getDisabled();

    // закрытие сообщения об успешной отправке

    var onEscPress = function (evt) {
      window.util.isEscEvent(evt, onSuccessMessageClick);
    };

    var onSuccessMessageClick = function () {
      main.removeChild(success);
      document.removeEventListener('click', onSuccessMessageClick);
      document.removeEventListener('keydown', onEscPress);
    };

    document.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onEscPress);
  };

  window.form = {
    setAddress: setAddress,
    getActivate: getActivate,
    getDisabled: getDisabled
  };
})();
