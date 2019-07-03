'use strict';

(function () {
  var pinsList = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector(' .map__pin--main');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var errorButton = document.querySelector('.error__button');
  var housingTypeSelect = document.querySelector('#housing-type');
  var defaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };

  // добавить кучку пинов в разметку
  var ads = [];
  var checkedTypeOFHousing = 'any';
  housingTypeSelect.addEventListener('click', function (evt) {
    checkedTypeOFHousing = evt.target.value;
    updatePins();
  });

  var updatePins = function () {
    if (checkedTypeOFHousing !== 'any') {
      removeElements(document.querySelectorAll('.pin'));
      renderPins(ads.filter(function (ad) {
        return ad.offer.type === checkedTypeOFHousing;
      }).slice(0, 5));
    } else {
      renderPins(ads.slice(0, 5));
    }
  };

  var renderPins = function (data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(window.pin.render(data[i]));
    }
    pinsList.appendChild(fragment);
  };

  var onLoad = function (data) {
    ads = data;
    updatePins();
  };

  // активация страницы после перемещения пина

  var activateMap = function () {
    map.classList.remove('map--faded');
    window.load(onLoad, onError);
    dragged = true;
  };

  var removeElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
  };

  var deactivateMap = function () {
    map.classList.add('map--faded');
    mainPin.style.left = defaultCoords.x;
    mainPin.style.top = defaultCoords.y;
    removeElements(document.querySelectorAll('.pin'));
    dragged = false;
  };


  var onError = function () {
    var error = errorTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(error);
    deactivateMap();
    window.form.getDisabled();

    var errorClose = function () {
      main.removeChild(error);
      activateMap();
      window.form.setAddress();
      window.form.getActivate();
      document.removeEventListener('keydown', onErrorEscPress);
      errorButton.removeEventListener('click', errorClose);
      document.removeEventListener('click', errorClose);
    };

    var onErrorEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        errorClose();
      }
    };

    errorButton.addEventListener('click', errorClose);
    document.addEventListener('click', errorClose);
    document.addEventListener('keydown', onErrorEscPress);

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
    deactivate: deactivateMap
  };
})();


