'use strict';

(function () {
  var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // создать пин

  var renderPin = function (ad) {
    var pin = similarPinTemplate.cloneNode(true);
    pin.classList.add('pin');
    pin.style.left = (ad.location.x - window.constants.PIN_WIDTH / 2) + 'px';
    pin.style.top = (ad.location.y - window.constants.PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = ad.author.avatar;
    pin.querySelector('img').alt = ad.offer.typeSelect;

    return pin;
  };

  window.pin = {
    renderPin: renderPin
  }
})();


