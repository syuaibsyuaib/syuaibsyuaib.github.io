const urlScript = "https://script.google.com/macros/s/AKfycbwuxrKyFRK-jb8snViHPFZrM2bVu_i-zUKkX-Ybepbl9WsBW9r4FC-ULJ76Y7PbcJMc/exec";

function scanning() {
  window.AppInventor.setWebViewString("scan");
}

function setHasil(hasil) {
  $("#pesan").text(hasil);
  fetch(urlScript, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flag: "hasil",
      data: hasil,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
        $("#pesan").text(res);
      //   document.getElementById("hasil").innerHTML = res.pesan;
    })
    .catch((err) => {
        $("#pesan").text(res);
    });
}

ambilDataSiswa();
function ambilDataSiswa() {
  $(".modal-backdrop").show();
  $("#loading").show();
  fetch(urlScript, {
    method: "POST",
    body: JSON.stringify({
      flag: "ambil data siswa",
      data: "1/2025",
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      let data = res.pesan;
      $("#pesan").text(data);
      generateTableContent(data)
      $("#loading").hide();
      $(".modal-backdrop").remove();
    })
    .catch((err) => {
      $("#pesan").text(err);
      $("#loading").modal("hide");
    });
}

function generateTableContent(data) {
  let html = "";
  data.forEach((item, index) => {
    html += `<tr>
                <td>${index + 1}</td>
                <td>${item[1]}</td>
                <td>${item[2]}</td>
                <td>hadir</td>
                </tr>`;
  });
  document.querySelector("tbody").innerHTML = html;
}
