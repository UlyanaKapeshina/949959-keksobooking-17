'use strict';

(function () {
  var ANY_TYPE = 'any';
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;
  var housingTypeSelect = document.querySelector('#housing-type');
  var housingPriceSelect = document.querySelector('#housing-price');
  var housingRoomsSelect = document.querySelector('#housing-rooms');
  var housingGuestsSelect = document.querySelector('#housing-guests');


  var getTypePrice = function (price) {
    if (price > MAX_PRICE) {
      return 'high';
    }
    if (price < MIN_PRICE) {
      return 'low';
    }
    return 'middle';
  };

  window.filter = function (data) {
    var checkedTypeOFHousing = housingTypeSelect.value;
    var checkedPrice = housingPriceSelect.value;
    var checkedRooms = housingRoomsSelect.value;
    var checkedGuests = housingGuestsSelect.value;

    var validateNull = function (element) {
      return typeof element !== 'undefined' && element !== null;
    };
    var filterTypeOfHousing = function (card) {
      return checkedTypeOFHousing === ANY_TYPE || card.offer.type === checkedTypeOFHousing;
    };

    var filterRooms = function (card) {
      return checkedRooms === ANY_TYPE || card.offer.rooms === parseInt(housingRoomsSelect.value, 10);
    };
    var filterPrice = function (card) {
      return checkedPrice === ANY_TYPE || checkedPrice === getTypePrice(card.offer.price);
    };
    var filterGuests = function (card) {
      return checkedGuests === ANY_TYPE || card.offer.guests === parseInt(checkedGuests, 10);
    };
    var featureFilter = document.querySelectorAll('input[name=features]:checked');
    var featuresValues = Array.from(featureFilter).map(function (feature) {
      return feature.value;
    });

    var filterFeature = function (card) {
      return featuresValues.length === 0 || featuresValues.every(function (feature) {
        return card.offer.features.includes(feature);
      });
    };

    data = data.filter(function (ad) {
      return validateNull(ad) && validateNull(ad.offer) && filterTypeOfHousing(ad) && filterRooms(ad) && filterPrice(ad) && filterGuests(ad) && filterFeature(ad);
    });
    return data;
  };
})();
