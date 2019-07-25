'use strict';
(function () {
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;
  var similarPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // создать пин

  var renderPin = function (ad) {
    var pin = similarPinTemplate.cloneNode(true);
    pin.classList.add('pin');
    pin.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
    pin.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
    pin.querySelector('img').src = ad.author.avatar;
    pin.querySelector('img').alt = ad.offer.type;
    return pin;
  };

  window.pin = {
    render: renderPin
  };
})();


