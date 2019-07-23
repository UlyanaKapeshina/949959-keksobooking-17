'use strict';
(function () {


  // закрытие сообщения по нажатию ESC

  var onEscPress = function (evt) {
    window.util.invokeIfEscEvent(evt, onErrorCloseClick);
  };

  // закрытие сообщения об ошибке

  var onErrorCloseClick = function () {
    var errorButton = document.querySelector('.error__button');
    document.querySelector('.error').remove();
    document.removeEventListener('keydown', onEscPress);
    errorButton.removeEventListener('click', onErrorCloseClick);
    document.removeEventListener('click', onErrorCloseClick);
  };

  // создание сообщения об ошибке если ошибка в присланных с сервера данных об объявлениях

  var onErrorData = function (message) {
    onError(message);
    window.map.deactivate();
    window.form.getDisabled();
  };

  // создание сообщения об ошибке если ошибка возникла при отправлении формы

  var onErrorForm = function (message) {
    onError(message);
    window.form.setAddress();
  };


  var onError = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var main = document.querySelector('main');
    var error = errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = message;
    main.appendChild(error);
    var errorButton = document.querySelector('.error__button');

    errorButton.addEventListener('click', onErrorCloseClick);
    document.addEventListener('click', onErrorCloseClick);
    document.addEventListener('keydown', onEscPress);

  };

  window.message = {
    onErrorData: onErrorData,
    onErrorForm: onErrorForm
  };

})();
