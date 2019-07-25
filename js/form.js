'use strict';
(function () {
  var Rules = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var Prices = {
    'BUNGALO': '0',
    'FLAT': '1000',
    'HOUSE': '5000',
    'PALACE': '10000'
  };
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_SPIKE = 20;
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
  var capacities = capacitySelect.querySelectorAll('option');
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
  var isActive = false;

  var setAddress = function () {
    var pinX = parseInt(mainPin.style.left, 10) + Math.ceil(MAIN_PIN_WIDTH / 2);
    var pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT + MAIN_PIN_SPIKE);
    if (!isActive) {
      pinY = parseInt(mainPin.style.top, 10) + Math.ceil(MAIN_PIN_HEIGHT / 2);
    }
    address.value = pinX + ', ' + pinY;
  };
  setAddress();

  // связывание селектов
  // синхронизация типа жилья и стоимости

  var setMinPrice = function (type) {
    priceInput.placeholder = Prices[type.toUpperCase()];
    priceInput.min = Prices[type.toUpperCase()];
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
    var guestsQuantities = Rules[roomsSelect.value];
    capacities.forEach(function (option) {
      option.selected = guestsQuantities.indexOf(option.value) !== -1;
      option.disabled = guestsQuantities.indexOf(option.value) === -1;
    });
  };

  // загрузка фотографий при нажатии

  var onPhotoChange = function (evt) {
    var input = evt.currentTarget;
    if (input.multiple) {
      processInputMultiple(input.files);
    } else {
      processInputOne(input.files);
    }
  };

  // обработка одной фотографии для превью

  var processInputOne = function (files) {
    window.preview.create(files[0], avatarPreview);
  };

  // обработка пачки фотографий для превью

  var processInputMultiple = function (files) {
    Array.from(files).forEach(function (file) {
      window.preview.createMultiple(file, container, div);
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
    window.form.images = [];
    removeDisabledAttribute(fieldsetsAndSelects);
    adForm.classList.remove('ad-form--disabled');
    timeInSelect.addEventListener('change', onTimeSelectChange);
    timeOutSelect.addEventListener('change', onTimeSelectChange);
    avatarChooser.addEventListener('change', onPhotoChange);
    photoChooser.addEventListener('change', onPhotoChange);
    onRoomsSelectClick();
    isActive = true;
    setAddress();
    roomsSelect.addEventListener('change', onRoomsSelectClick);
    typeSelect.addEventListener('change', onTypeSelectChange);
    resetButton.addEventListener('click', onResetFormClick);
    adForm.addEventListener('submit', onSubmitButtonClick);
    window.drop.getActivate(dropboxAvatar);
    window.drop.getActivate(dropboxPhotos);
    main.addEventListener('keydown', onEnterPress);
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
    isActive = false;
    setAddress();
    roomsSelect.removeEventListener('change', onRoomsSelectClick);
    avatarPreview.src = defaultAvatar;
    window.drop.getDeactivate(dropboxAvatar);
    window.drop.getDeactivate(dropboxPhotos);
    main.removeEventListener('keydown', onEnterPress);
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

  // выбор удобств в формах нажатием на enter

  var onEnterPress = function (evt) {
    var checkbox = evt.target;
    window.util.invokeIfEnterEvent(evt, function () {
      if (checkbox.type === 'checkbox') {
        evt.preventDefault();
        checkbox.checked = !checkbox.checked;
      }
    });
  };

  // отправка формы объявления

  var onSubmitButtonClick = function (evt) {
    evt.preventDefault();
    var formData = new FormData(adForm);
    formData.delete('images');
    formData.append('avatar', window.form.avatar);
    window.form.images.forEach(function (photo) {
      formData.append('images', photo);
    });
    window.backend.save(formData, onLoad, window.message.onErrorForm);
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
    window.message.onSuccess(success);
  };

  window.form = {
    setAddress: setAddress,
    getActivate: getActivate,
    getDisabled: getDisabled,
    processInputMultiple: processInputMultiple,
    processInputOne: processInputOne,
    images: [],
    avatar: null
  };
})();
