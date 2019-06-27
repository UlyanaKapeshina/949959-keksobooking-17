'use strict';

(function () {
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
  var mainPin = document.querySelector(' .map__pin--main');

  // создать пин

  var renderPin = function (ad) {
    var pin = similarPinTemplate.cloneNode(true);
    pin.classList.add('pin');
    pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = ad.author.avatar;
    pin.querySelector('img').alt = ad.offer.typeSelect;

    return pin;
  };

  // добавить кучку пинов в разметку

  var renderPins = function (ads) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(renderPin(ads[i]));
    }
    pinsList.appendChild(fragment);
  };

  // активация страницы после перемещения пина

  var activatePage = function () {
    window.form.getActivate();
    window.form.setAddress();
    map.classList.remove('map--faded');
    renderPins(window.data.getAds);
    dragged = true;
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

      if (mainPinY < MAX_Y && mainPinY > MIN_Y - MAIN_PIN_HEIGHT) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPinX < (MAX_X - MAIN_PIN_WIDTH) && mainPinX > MIN_X) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }
    };

    var onMouseUp = function (upEvt) {

      if (!dragged) {
        upEvt.preventDefault();
        activatePage();
        window.form.setAddress();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();


