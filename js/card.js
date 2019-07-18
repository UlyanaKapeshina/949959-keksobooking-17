'use strict';

(function () {
  var HOUSING_TYPE = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var similarCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var newPhoto = document.querySelector('#card').content.querySelector('.popup__photo').cloneNode(true);

  var validateNull = function (element) {
    return typeof element !== 'undefined' && element !== null;
  };

  var renderValue = function (element, data) {
    if (!validateNull(data)) {
      element.remove();
      return;
    }
    element.textContent = data;
  };


  // создать карточку

  var renderCard = function (ad) {

    var card = similarCardTemplate.cloneNode(true);
    card.classList.add('map__card', 'popup');
    card.style.left = (ad.location.x - window.constants.card_WIDTH / 2) + 'px';
    card.style.top = (ad.location.y - window.constants.card_HEIGHT) + 'px';
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('.popup__avatar').alt = 'Аватар пользователя';

    var renderPhotos = function (photos) {
      if (!validateNull(photos) || photos.length === 0) {
        card.querySelector('.popup__photos').remove();
        return;
      }

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
      if (!validateNull(features) || features.length === 0) {
        card.querySelector('.popup__features').remove();
        return;
      }

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

    var title = card.querySelector('.popup__title');
    renderValue(title, ad.offer.title);

    var address = card.querySelector('.popup__text--address');
    renderValue(address, ad.offer.address);

    var price = card.querySelector('.popup__text--price');
    renderValue(price, ad.offer.price);

    var type = card.querySelector('.popup__type');
    renderValue(type, HOUSING_TYPE[ad.offer.type]);

    var capacity = card.querySelector('.popup__text--capacity');
    renderValue(capacity, ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');

    var time = card.querySelector('.popup__text--time');
    renderValue(time, 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkin);

    var description = card.querySelector('.popup__description');
    renderValue(description, ad.offer.description);

    renderPhotos(ad.offer.photos);
    renderFeatures(ad.offer.features);

    var closeCard = function () {
      card.remove();

      card.querySelector('.popup__close').removeEventListener('click', closeCard);
      document.removeEventListener('keydown', onEscPress);
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
    };
    var onEscPress = function (evt) {
      window.util.isEscEvent(evt, closeCard);
    };

    card.querySelector('.popup__close').addEventListener('click', closeCard);
    document.addEventListener('keydown', onEscPress);
    return card;
  };

  window.card = {
    render: renderCard
  };
})();
