'use strict';

(function () {
  var similarCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  // создать карточку

  var renderCard = function (ad) {
    var card = similarCardTemplate.cloneNode(true);
    card.classList.add('map__card', 'popup');
    card.style.left = (ad.location.x - window.constants.card_WIDTH / 2) + 'px';
    card.style.top = (ad.location.y - window.constants.card_HEIGHT) + 'px';
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('.popup__avatar').alt = 'Аватар пользователя';
    card.querySelector('.popup__title').textContent = ad.offer.title;
    card.querySelector('.popup__text--address').textContent = ad.offer.address;
    card.querySelector('.popup__text--price').textContent = ad.offer.price;
    card.querySelector('.popup__type').textContent = ad.offer.type;
    card.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkin;
    card.querySelector('.popup__description').textContent = ad.offer.description;

    var photo = card.querySelector('.popup__photo');
    var fragment = document.createDocumentFragment();
    if (ad.offer.photos.length > 0) {
      for (var i = 0; i < ad.offer.photos.length; i++) {
        var newPhoto = photo.cloneNode(true);
        newPhoto.src = ad.offer.photos[i];
        newPhoto.alt = 'Фотография жилья';
        fragment.appendChild(newPhoto);
      }
    }
    card.querySelector('.popup__photos').appendChild(fragment);


    return card;
  };

  window.card = {
    render: renderCard
  };
})();
