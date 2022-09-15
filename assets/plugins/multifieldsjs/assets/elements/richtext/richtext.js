/**
 * @version 1.0
 */
MfJs.Elements['richtext'] = {
  templates: {
    wrapper: '' +
      '<div id="{{ id }}" class="col {{ class }}" {{ attr }}>\n' +
      '    {{ el.actions }}\n' +
      '    {{ el.title }}\n' +
      '    <textarea type="text" id="tv{{ id }}" class="form-control {{ item.class }}" name="tv{{ id }}" placeholder="{{ placeholder }}" onchange="documentDirty=true;" {{ item.attr }}>{{ value }}</textarea>\n' +
      '</div>',
  },

  init (id) {
    MfJs.Elements['richtext'].initEditor(id)

    document.addEventListener('DOMContentLoaded', () => {
      MfJs.Elements['richtext'].initEditor(id)
    })
  },

  initEditor (id) {
    let el = document.getElementById(id),
      theme = el.dataset['mfTheme'] ? el.dataset['mfTheme'] : '',
      options = el.dataset['mfOptions'] ? JSON.parse(el.dataset['mfOptions']) : {},
      inputEl = el.querySelector('textarea')

    /** @var tinymce */
    /** @var modxRTEbridge_tinymce4 */
    /** @var myCodeMirrors */

    if (typeof tinymce !== 'undefined') {
      let conf = theme !== undefined ? window['config_tinymce4_' + theme] : window[modxRTEbridge_tinymce4.default]
      conf = { ...conf, ...options }
      conf.selector = '#' + inputEl.id
      if (document.body.classList.contains('darkness')) {
        conf.skin = 'oxide-dark'
        conf.content_css = 'dark'
      }
      el.querySelectorAll('.mce-tinymce').forEach(div => {
        div.parentElement.removeChild(div)
      })
      inputEl.style.display = 'block'
      conf.setup = ed => {
        ed.on('change', () => {
          inputEl.innerHTML = ed.getContent()
        })
      }
      tinymce.init(conf)
    } else if (typeof myCodeMirrors !== 'undefined') {
      if (myCodeMirrors['ta']) {
        options = Object.assign({}, myCodeMirrors['ta'].options, options)
      }
      el.querySelectorAll('.CodeMirror').forEach(div => {
        div.parentElement.removeChild(div)
      })
      inputEl.style.display = 'block'
      myCodeMirrors[inputEl.id] = CodeMirror.fromTextArea(inputEl, options)
      myCodeMirrors[inputEl.id].on('change', (cm, n) => {
        inputEl.innerHTML = cm.getValue()
      })
    }
  },
}
