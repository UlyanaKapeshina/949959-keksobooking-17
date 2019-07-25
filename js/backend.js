'use strict';
(function () {
  var TIME = 10000;
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL = 'https://js.dump.academy/keksobooking';
  var SUCCESS_CODE = 200;

  // создание хттп запроса и обработчиков ответов на запрос

  var setRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    return xhr;
  };

  // загрузка данных для объявлений

  var load = function (onLoad, onError) {
    var xhr = setRequest(onLoad, onError);
    xhr.timeout = TIME;
    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  // отправка данных объявления из формы

  var save = function (data, onLoad, onError) {
    var xhr = setRequest(onLoad, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
