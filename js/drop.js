'use strict';
(function () {
  var FOCUS_STYLE = 'color: #ff5635; box-shadow: 0 0 2px 2px #ff6547';

  // загрузка превью изображений перетаскиванием из папки фоторгафий

  var getActivateDrop = function (dropbox) {
    // dropbox.addEventListener('dragenter', noopHandler, false);
    // dropbox.addEventListener('dragexit', noopHandler, false);
    dropbox.addEventListener('dragover', noopHandler, false);
    dropbox.addEventListener('dragleave', noopHandler2, false);
    dropbox.addEventListener('drop', drop, false);
  };
  var getDeactivateDrop = function (dropbox) {
    dropbox.removeEventListener('dragover', noopHandler, false);
    dropbox.removeEventListener('drop', drop, false);
  };
  var drop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var input = document.getElementById(evt.currentTarget.htmlFor);
    if (input.multiple) {
      window.drop.processInputMultiple(evt.dataTransfer.files);
    } else {
      window.drop.processInputOne(evt.dataTransfer.files);
    }
    evt.currentTarget.style = '';
  };

  var noopHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.currentTarget.style = FOCUS_STYLE;
  };
  var noopHandler2 = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.currentTarget.style = '';
  };

  window.drop = {
    getActivate: getActivateDrop,
    getDeactivate: getDeactivateDrop,
    processInputOne: null,
    processInputMultiple: null
  };


})();
