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
    data = data.filter(function (ad) {
      return validateNull(ad) && validateNull(ad.offer);
    });

    if (checkedTypeOFHousing !== ANY_TYPE) {
      data = data.filter(function (ad) {
        return ad.offer.type === checkedTypeOFHousing;
      });
    }

    if (checkedRooms !== ANY_TYPE) {

      data = data.filter(function (ad) {
        return ad.offer.rooms === parseInt(housingRoomsSelect.value, 10);
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
    var featuresValues = Array.from(featureFilter).map(function (feature) {
      return feature.value;
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
