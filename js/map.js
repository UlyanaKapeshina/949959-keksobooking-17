'use strict';

(function () {
  var pinsList = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector(' .map__pin--main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var housingTypeSelect = document.querySelector('#housing-type');

  var QUANTITY_PINS = 5;
  var ANY_TYPE = 'any';
  var defaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };

  var ads = [];
  var checkedTypeOFHousing = housingTypeSelect.value;
  housingTypeSelect.addEventListener('change', function (evt) {
    checkedTypeOFHousing = evt.target.value;
    updatePins();
  });
  // фильтрация пинов

  var updatePins = function () {
    removeElements(document.querySelectorAll('.pin'));
    renderPins(filterPins(ads).slice(0, QUANTITY_PINS));
  };
  var filterPins = function (data) {
    return checkedTypeOFHousing !== ANY_TYPE ?
      data.filter(function (ad) {
        return ad.offer.type === checkedTypeOFHousing;
      }) :
      data;
  };
  // отрисовка пинов

  var renderPins = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (ad) {
      var onClick = function () {
        document.querySelectorAll('.map__card').forEach(function (card) {
          card.remove();
        });
        map.insertBefore(window.card.render(ad), document.querySelector('.map__filters-container'));
      };
      var pin = window.pin.render(ad);
      pin.addEventListener('click', onClick);
      fragment.appendChild(pin);
    });
    pinsList.appendChild(fragment);
  };

  var onLoad = function (data) {
    ads = data;
    updatePins();
  };


  // активация карты после перемещения пина

  var activateMap = function () {
    map.classList.remove('map--faded');
    window.backend.load(onLoad, onError);
    dragged = true;
  };

  var removeElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  };
  // деактивация карты

  var deactivateMap = function () {
    map.classList.add('map--faded');
    mainPin.style.left = defaultCoords.x;
    mainPin.style.top = defaultCoords.y;
    removeElements(document.querySelectorAll('.pin'));
    removeElements(document.querySelectorAll('.map__card'));
    dragged = false;
  };

  //
  var onError = function (message) {
    var error = errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    var main = document.querySelector('main');
    main.appendChild(error);
    deactivateMap();
    window.form.getDisabled();

    var errorClose = function () {
      main.removeChild(error);
      activateMap();
      window.form.setAddress();
      window.form.getActivate();
      document.removeEventListener('keydown', onEscPress);
      errorButton.removeEventListener('click', errorClose);
      document.removeEventListener('click', errorClose);
    };

    var onEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        errorClose();
      }
    };
    var errorButton = document.querySelector('.error__button');
    errorButton.addEventListener('click', errorClose);
    document.addEventListener('click', errorClose);
    document.addEventListener('keydown', onEscPress);

  };

    // перемещения пина

  var dragged = false;

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

      if (mainPinY < window.constants.MAX_Y && mainPinY > window.constants.MIN_Y - window.constants.MAIN_PIN_HEIGHT) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPinX < (window.constants.MAX_X - window.constants.MAIN_PIN_WIDTH) && mainPinX > window.constants.MIN_X) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {

      if (!dragged) {
        upEvt.preventDefault();
        activateMap();
        window.form.setAddress();
        window.form.getActivate();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.map = {
    deactivate: deactivateMap,
    onError: onError
  };
})();


