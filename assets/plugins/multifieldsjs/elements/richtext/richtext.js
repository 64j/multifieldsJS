MfJs.add('richtext', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <textarea type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>[+value+]</textarea>\n' +
      '</div>',

  initElement: function(id) {
    MfJs.elements['richtext'].initEditor(id);

    document.addEventListener('DOMContentLoaded', function() {
      MfJs.elements['richtext'].initEditor(id);
    });

  },

  initEditor: function(id) {
    let el = document.getElementById(id),
        theme = el.dataset['mfTheme'] ? el.dataset['mfTheme'] : '',
        options = el.dataset['mfOptions'] ? JSON.parse(el.dataset['mfOptions']) : {},
        inputEl = el.querySelector('textarea');

    /** @var tinymce */
    /** @var modxRTEbridge_tinymce4 */
    /** @var myCodeMirrors */

    if (typeof tinymce !== 'undefined') {
      let conf = theme !== undefined ? window['config_tinymce4_' + theme] : window[modxRTEbridge_tinymce4.default];
      conf = Object.assign({}, conf, options);
      conf.selector = '#' + inputEl.id;
      if (document.body.classList.contains('darkness')) {
        conf.skin = 'oxide-dark';
        conf.content_css = 'dark';
      }
      [...el.querySelectorAll('.mce-tinymce')].map(function(div) {
        div.parentElement.removeChild(div);
      });
      inputEl.style.display = 'block';
      conf.setup = function(ed) {
        ed.on('change', function(e) {
          inputEl.innerHTML = ed.getContent();
        });
      };
      tinymce.init(conf);
    } else if (typeof myCodeMirrors !== 'undefined') {
      if (myCodeMirrors['ta']) {
        options = Object.assign({}, myCodeMirrors['ta'].options, options);
      }
      [...el.querySelectorAll('.CodeMirror')].map(function(div) {
        div.parentElement.removeChild(div);
      });
      inputEl.style.display = 'block';
      myCodeMirrors[inputEl.id] = CodeMirror.fromTextArea(inputEl, options);
      myCodeMirrors[inputEl.id].on('change', function(cm, n) {
        inputEl.innerHTML = cm.getValue();
      });
    }
  }
});