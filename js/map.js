'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MAIN_PIN_HEIGHT = 82;
  var MAIN_PIN_WIDTH = 62;
  var QUANTITY_PINS = 5;
  var pinsList = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mainPin = document.querySelector(' .map__pin--main');
  var defaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };
  var ads = [];

  // фильтрация пинов

  var updatePins = function () {
    window.util.removeElements(document.querySelectorAll('.pin'));
    window.util.removeElements(document.querySelectorAll('.map__card'));
    renderPins(window.filter(ads).slice(0, QUANTITY_PINS));
  };

  // отрисовка пинов

  var renderPins = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (ad) {

      // при нажатии на пин
      // удаляется подсвечивание других пинов;
      // открывается карточка объявления и подсвечивается пин

      var onClick = function () {
        document.querySelectorAll('.pin').forEach(function (pin) {
          pin.classList.remove('map__pin--active');
        });
        map.insertBefore(window.card.render(ad), document.querySelector('.map__filters-container'));
        pin.classList.add('map__pin--active');
      };

      var pin = window.pin.render(ad);
      pin.addEventListener('click', onClick);
      fragment.appendChild(pin);
    });

    pinsList.appendChild(fragment);
  };

  // загрузка данных с сервера и отрисовка по ним объявлений
  var onLoad = function (data) {
    ads = data;
    updatePins();
    mapFilters.addEventListener('change', onFiltersChange);
    map.classList.remove('map--faded');
    window.form.getActivate();
    dragged = true;
  };

  // удаление дребезга при фильтрации пинов

  var onFiltersChange = function () {
    window.debounce(updatePins);
  };

  // активация карты после перемещения пина
  var activateMap = function () {
    window.backend.load(onLoad, window.message.onErrorData);
    mainPin.removeEventListener('keydown', onEnterPress);
  };

  // деактивация карты

  var deactivateMap = function () {
    map.classList.add('map--faded');
    mainPin.style.left = defaultCoords.x;
    mainPin.style.top = defaultCoords.y;
    window.util.removeElements(document.querySelectorAll('.pin'));
    window.util.removeElements(document.querySelectorAll('.map__card'));
    mapFilters.removeEventListener('change', onFiltersChange);
    mainPin.addEventListener('keydown', onEnterPress);
    dragged = false;
  };

  // перемещения пина

  var dragged = false;

  var onEnterPress = function (evt) {
    window.util.invokeIfEnterEvent(evt, activateMap);
  };

  mainPin.addEventListener('keydown', onEnterPress);

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.form.setAddress();

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

      if (mainPinY + MAIN_PIN_HEIGHT <= MAX_Y && mainPinY + MAIN_PIN_HEIGHT >= MIN_Y) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPinX >= MIN_X && mainPinX <= MAX_X - MAIN_PIN_WIDTH) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

    };

    var onMouseUp = function (upEvt) {

      if (!dragged) {
        upEvt.preventDefault();
        activateMap();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    deactivate: deactivateMap
  };
})();
