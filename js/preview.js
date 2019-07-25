'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var IMAGE_ALT = 'Фотография жилья';
  var WIDTH = 70;
  var HEIGHT = 70;
  var IMAGE_STYLE = 'border-radius: 5px';
  var DIV_STYLE = 'cursor: move; user-select: none';

  // создание элемента разметки для загрузки фотографии

  var renderImg = function (container, div) {
    var image = document.createElement('img');
    image.alt = IMAGE_ALT;
    image.width = WIDTH;
    image.height = HEIGHT;
    image.style = IMAGE_STYLE;

    var newDiv = div.cloneNode();
    newDiv.draggable = true;
    newDiv.style = DIV_STYLE;
    newDiv.appendChild(image);
    container.appendChild(newDiv);
    return image;
  };

  // загрузка фоторгафии если формат соответствует

  var createPreviewOne = function (file, preview) {
    if (checkFileType(file)) {
      window.form.avatar = file;
      readFile(preview, file);
    }
  };
  var createPreviewMultiple = function (file, container, div) {
    if (checkFileType(file)) {
      window.form.images.push(file);
      var preview = renderImg(container, div);
      readFile(preview, file);
    }
  };

  // чтение url файла и запись адреса изображения

  var readFile = function (preview, file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  // проверка типа загружаемого файла

  var checkFileType = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  window.preview = {
    create: createPreviewOne,
    createMultiple: createPreviewMultiple
  };
})();
