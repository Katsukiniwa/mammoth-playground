(function () {
  document
    .getElementById("document")
    .addEventListener("change", handleFileSelect, false);

  const fileSelect = document.getElementById("fileSelect");
  const fileElem = document.getElementById("document");

  fileSelect.addEventListener(
    "click",
    (_) => {
      if (fileElem) {
        fileElem.click();
      }
    },
    false
  );

  var fileDownload = document.getElementById("fileDownload");
  fileDownload.addEventListener(
    "click",
    (_) => {
      var htmlContent = document.getElementById("output").outerHTML;

      // Blobオブジェクトを作成
      var blob = new Blob([htmlContent], { type: "text/html" });

      // ダウンロード用のURLを作成
      var url = URL.createObjectURL(blob);

      // リンクを生成し、クリックしてダウンロードさせる
      var a = document.createElement("a");
      a.href = url;
      a.download = "index.html";
      document.body.appendChild(a);
      a.click();

      // 不要なURLオブジェクトを解放
      URL.revokeObjectURL(url);
    },
    false
  );

  function handleFileSelect(event) {
    readFileInputEventAsArrayBuffer(event, function (arrayBuffer) {
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then(displayResult, function (error) {
          console.error(error);
        });
    });
  }

  function displayResult(result) {
    document.getElementById("output").innerHTML = result.value;
    document.getElementById("detail").innerText = result.value;

    var messageHtml = result.messages
      .map(function (message) {
        return (
          '<li class="' +
          message.type +
          '">' +
          escapeHtml(message.message) +
          "</li>"
        );
      })
      .join("");

    document.getElementById("messages").innerHTML =
      "<ul>" + messageHtml + "</ul>";
  }

  function readFileInputEventAsArrayBuffer(event, callback) {
    var file = event.target.files[0];

    var reader = new FileReader();

    reader.onload = function (loadEvent) {
      var arrayBuffer = loadEvent.target.result;
      callback(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
