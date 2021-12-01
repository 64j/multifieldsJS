MfJs.add('id', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <input type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" value="[+value+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>\n' +
      '</div>',

  initElement: function(id) {
    let el = document.getElementById(id);
    if (el) {
      [...el.closest('.mfjs-items').parentElement.closest('.mfjs-items').querySelectorAll('[data-type="id"] input')].map(function(input, index) {
        input.value = index + 1;
      });
    }
  },

  initElementAfterMove: function(id) {
    let el = document.getElementById(id);
    let idEl = el.querySelector(':scope > .mfjs-items [data-type="id"]');
    if (idEl && idEl.closest('.mfjs-items').parentElement.closest('.mfjs-items')) {
      [...idEl.closest('.mfjs-items').parentElement.closest('.mfjs-items').querySelectorAll('[data-type="id"] input')].map(function(input, index) {
        input.value = index + 1;
      });
    }
  }
});