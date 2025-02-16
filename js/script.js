const urlScript = "https://script.google.com/macros/s/AKfycbwuxrKyFRK-jb8snViHPFZrM2bVu_i-zUKkX-Ybepbl9WsBW9r4FC-ULJ76Y7PbcJMc/exec";

function scanning() {
  window.AppInventor.setWebViewString("scan");
}

function setHasil(hasil_scan) {
  log(hasil_scan)

  ambilDataSiswa("hasil scan", { nisn: hasil_scan });
}

const dt = new Date();
const tgl = dt.getDate();
const bln = dt.getMonth() + 1;
const thn = dt.getFullYear();
const bln_thn = `${bln}/${thn}`;
$('#tanggal').text(`Tanggal : ${tgl}-${bln}-${thn}`)

ambilDataSiswa("ambil data siswa", { bln_thn: bln_thn });

function ambilDataSiswa(flag, obj = {}) {
  $(".modal-backdrop").show();
  $("#loading").show();
  fetch(urlScript, {
    method: "POST",
    body: JSON.stringify({
      flag: flag,
      obj: obj,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      let data = res.pesan;
      log(data)
      data.shift()
      generateTableContent(data);
      $("#loading").hide();
      $(".modal-backdrop").remove();
    })
    .catch((err) => {
      log(err);
      $("#loading").modal("hide");
    });
}

function generateTableContent(data) {
  let html = "";
  console.log(data);
  data.forEach((item, index) => {
    html += `<tr>
                <td>${index + 1}</td>
                <td>${item[1]}</td>
                <td>${item[2]}</td>
                <td>${item[tgl + 3] ? "hadir" : ""}</td>
                </tr>`;
  });
  document.querySelector("tbody").innerHTML = html;
}

function log(data){
    if(typeof(data) == "object"){
        $("#pesan").text(JSON.stringify(data, null, 1));
    }else{
        $("#pesan").text(data);
    }
    hljs.highlightAll();
}