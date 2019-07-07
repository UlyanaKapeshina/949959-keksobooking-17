'use strict';

(function () {
  var similarCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var newPhoto = document.querySelector('#card').content.querySelector('.popup__photo').cloneNode(true);
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

    var renderPhotos = function (photos) {
      card.querySelectorAll('.popup__photo').forEach(function (photo) {
        photo.remove();
      });

      var fragment = document.createDocumentFragment();
      photos.forEach(function (photo) {
        newPhoto.src = photo;
        fragment.appendChild(newPhoto.cloneNode(true));
      });
      card.querySelector('.popup__photos').appendChild(fragment);
    };

    var renderFeatures = function (features) {
      var fragmentFeature = document.createDocumentFragment();
      card.querySelectorAll('.popup__feature').forEach(function (feature) {
        feature.remove();
      });

      features.forEach(function (feature) {
        var newFeature = document.createElement('li');
        newFeature.classList.add('popup__feature', 'popup__feature--' + feature);
        fragmentFeature.appendChild(newFeature);
      });
      card.querySelector('.popup__features').appendChild(fragmentFeature);
    };
    var onClose = function () {
      card.remove();
      card.querySelector('.popup__close').removeEventListener('click', onClose);
      document.removeEventListener('keydown', onEscPress);
    };
    var onEscPress = function (evt) {
      if (evt.keyCode === window.constants.ESC_KEYCODE) {
        onClose();
      }
    };

    renderPhotos(ad.offer.photos);
    renderFeatures(ad.offer.features);

    card.querySelector('.popup__close').addEventListener('click', onClose);
    document.addEventListener('keydown', onEscPress);
    return card;
  };

  window.card = {
    render: renderCard
  };
})();
