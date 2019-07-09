'use strict';

(function () {
  var ANY_TYPE = 'any';
  var housingTypeSelect = document.querySelector('#housing-type');
  var housingPriceSelect = document.querySelector('#housing-price');
  var housingRoomsSelect = document.querySelector('#housing-rooms');
  var housingGuestsSelect = document.querySelector('#housing-guests');
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;

  var getTypePrice = function (price) {
    var type;
    if (price > MAX_PRICE) {
      type = 'high';
    } else if (price < MIN_PRICE) {
      type = 'low';
    } else {
      type = 'middle';
    }
    return type;
  };

  window.filter = function (data) {
    var checkedTypeOFHousing = housingTypeSelect.value;
    var checkedPrice = housingPriceSelect.value;
    var checkedRooms = housingRoomsSelect.value;
    var checkedGuests = housingGuestsSelect.value;
    if (checkedTypeOFHousing !== ANY_TYPE) {
      data = data.filter(function (ad) {
        return ad.offer.type === checkedTypeOFHousing;
      });
    }

    if (checkedRooms !== ANY_TYPE) {

      data = data.filter(function (ad) {
        return ad.offer.rooms === parseInt(checkedRooms, 10);
      });
    }
    if (checkedPrice !== ANY_TYPE) {
      data = data.filter(function (ad) {
        return checkedPrice === getTypePrice(ad.offer.price);
      });
    }
    if (checkedGuests !== ANY_TYPE) {
      data = data.filter(function (ad) {

        return ad.offer.guests === parseInt(checkedGuests, 10);
      });
    }
    var featureFilter = document.querySelectorAll('input[name=features]:checked');
    var featuresValues = [];
    featureFilter.forEach(function (feature) {
      featuresValues.push(feature.value);
    });
    if (featuresValues.length > 0) {
      data = data.filter(function (ad) {
        return featuresValues.every(function (feature) {
          return ad.offer.features.includes(feature);
        });
      });
    }
    return data;
  };

})();
