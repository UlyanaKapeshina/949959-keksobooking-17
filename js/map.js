'use strict';

(function () {
  var pinsList = document.querySelector('.map__pins');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector(' .map__pin--main');
  var defaultCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };

  // добавить кучку пинов в разметку

  var onLoad = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(window.pin.renderPin(ads[i]));
    }
    pinsList.appendChild(fragment);
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
  };


  var onError = function () {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var error = errorTemplate.cloneNode(true);
    var main = document.querySelector('main');
    main.appendChild(error);
    var errorButton = document.querySelector('.error__button');

    deactivateMap();
    window.form.getDisabled();

    var errorClose = function () {
      main.removeChild(error);
      activateMap();
      window.form.setAddress();
      window.form.getActivate();
      document.removeEventListener('keydown', onErrorEscPress);
      errorButton.removeEventListener('click', errorClose);
      errorButton.removeEventListener('keydown', onErrorEscPress);
    };

    var onErrorEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE || (evt.keyCode === window.constants.ENTER_KEYCODE && evt.target === errorButton)) {
        errorClose();
      }
    };

    errorButton.addEventListener('click', errorClose);
    document.addEventListener('click', errorClose);
    errorButton.addEventListener('keydown', onErrorEscPress);
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
    deactivateMap: deactivateMap
  }
})();


