'use strict';
(function () {
  var FOCUS_STYLE = 'color: #ff5635; box-shadow: 0 0 2px 2px #ff6547';

  // загрузка превью изображений перетаскиванием из папки фоторгафий

  var getActivateDrop = function (dropbox) {
    dropbox.addEventListener('dragover', onDragOver, false);
    dropbox.addEventListener('dragleave', onDragLeave, false);
    dropbox.addEventListener('drop', onDrop, false);
  };
  var getDeactivateDrop = function (dropbox) {
    dropbox.removeEventListener('dragover', onDragOver, false);
    dropbox.removeEventListener('dragleave', onDragLeave, false);
    dropbox.removeEventListener('drop', onDrop, false);
  };
  var onDrop = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var input = document.querySelector('#' + evt.currentTarget.htmlFor);
    if (input.multiple) {
      window.form.processInputMultiple(evt.dataTransfer.files);
    } else {
      window.form.processInputOne(evt.dataTransfer.files);
    }
    evt.currentTarget.style = '';
  };

  var onDragOver = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.currentTarget.style = FOCUS_STYLE;
  };
  var onDragLeave = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.currentTarget.style = '';
  };

  window.drop = {
    getActivate: getActivateDrop,
    getDeactivate: getDeactivateDrop
  };
})();
