'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  // создание элемента разметки для загрузки фотографии

  var renderImg = function (container, div) {
    var image = document.createElement('img');
    image.alt = 'Фотография жилья';
    image.width = '70';
    image.height = '70';
    image.style = 'border-radius: 5px';

    var newDiv = div.cloneNode();
    newDiv.draggable = true;
    newDiv.style = 'cursor: move; user-select: none';
    newDiv.appendChild(image);
    container.appendChild(newDiv);
    return image;
  };

  // загрузка фоторгафии если формат соответствует

  var createPreview = function (file, preview) {
    if (checkFileType(file)) {
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
    create: createPreview,
    render: renderImg
  };
})();
