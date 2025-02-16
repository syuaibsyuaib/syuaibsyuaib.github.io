function generateTemplate(mode, idTag, tag) {
  if (mode == "load") {
    $.ajax(`template/${tag}.html`).done(function (data) {
      $(data).insertAfter(idTag);
      $(idTag).remove();
    }).fail(function(){
      console.error(tag + ' tidak ditemukan')
    });
} else if (mode == "tag") {
    $(tag).insertAfter(idTag);
    $(idTag).remove();
  }else{
    console.error(mode + ' tidak sesuai, gunakan "load" atau "tag"')
  }
}

// export {generateTemplate};

// const sidebarMenu = `<div class="col-12 col-md-3">
//     <div class="list-group">
//         <a href="#" class="list-group-item list-group-item-action">Anggota</a>
//         <a href="#" class="list-group-item list-group-item-action">Stok Barang</a>
//         <a href="#" class="list-group-item list-group-item-action">Pinjaman</a>
//         <a href="#" class="list-group-item list-group-item-action">Pembayaran</a>
//     </div>
// </div>`;

// generateTemplate('tag', '#sidebar', sidebarMenu);
