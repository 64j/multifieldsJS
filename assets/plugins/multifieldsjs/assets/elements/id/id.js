/**
 * @version 1.0
 */
MfJs.Elements['id'] = {
  templates: {
    wrapper: '' +
      '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
      '    [+el.actions+]\n' +
      '    [+el.title+]\n' +
      '    <input type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" value="[+value+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>\n' +
      '</div>',
  },

  Render: {
    init (id) {
      if (!MfJs.Container.isLoaded) {
        return
      }
      let el = document.getElementById(id)
      if (el) {
        MfJs.Elements.id.autoincrement(el)
      }
    },
  },

  autoincrement (el) {
    el.closest('.mfjs-items').parentElement.closest('.mfjs-items').querySelectorAll('[data-type="id"] input').forEach((input, index) => {
      input.value = index + 1
    })
  },
}
