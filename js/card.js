'use strict';

(function () {
  var HousingType = {
    'FLAT': 'Квартира',
    'HOUSE': 'Дом',
    'BUNGALO': 'Бунгало',
    'PALACE': 'Дворец'
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

  var renderPhotos = function (photos, card) {
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

  var renderFeatures = function (features, card) {
    if (!validateNull(features) || features.length === 0) {
      card.querySelector('.popup__features').remove();
      return;
    }
    card.querySelectorAll('.popup__feature').forEach(function (feature) {
      feature.remove();
    });
    var fragmentFeature = document.createDocumentFragment();
    features.forEach(function (feature) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature', 'popup__feature--' + feature);
      fragmentFeature.appendChild(newFeature);
    });
    card.querySelector('.popup__features').appendChild(fragmentFeature);
  };

  // создать карточку

  var renderCard = function (ad) {
    document.querySelectorAll('.map__card').forEach(function (card) {
      card.remove();
      document.removeEventListener('keydown', onEscPress);
    });

    var card = similarCardTemplate.cloneNode(true);
    card.classList.add('map__card', 'popup');
    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('.popup__avatar').alt = 'Аватар пользователя';

    var title = card.querySelector('.popup__title');
    renderValue(title, ad.offer.title);

    var address = card.querySelector('.popup__text--address');
    renderValue(address, ad.offer.address);

    var price = card.querySelector('.popup__text--price');
    renderValue(price, ad.offer.price);

    var type = card.querySelector('.popup__type');
    renderValue(type, HousingType[ad.offer.type.toUpperCase()]);

    var capacity = card.querySelector('.popup__text--capacity');
    renderValue(capacity, ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');

    var time = card.querySelector('.popup__text--time');
    renderValue(time, 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkin);

    var description = card.querySelector('.popup__description');
    renderValue(description, ad.offer.description);

    renderPhotos(ad.offer.photos, card);
    renderFeatures(ad.offer.features, card);

    card.querySelector('.popup__close').addEventListener('click', removeCard);
    document.addEventListener('keydown', onEscPress);

    return card;
  };

  var removeCard = function () {
    document.querySelector('.map__pin--active').classList.remove('map__pin--active');
    document.querySelector('.popup__close').removeEventListener('click', removeCard);
    document.querySelector('.map__card').remove();
    document.removeEventListener('keydown', onEscPress);
  };
  var onEscPress = function (evt) {
    window.util.invokeIfEscEvent(evt, removeCard);
  };

  window.card = {
    render: renderCard
  };
})();
