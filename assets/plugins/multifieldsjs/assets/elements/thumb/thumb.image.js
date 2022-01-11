/**
 * @version 1.0
 */
MfJs.Elements['thumb:image'] = {
  popup: null,
  parent: null,
  interval: null,

  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="mfjs-thumb col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
        '    [+title+]\n' +
        '    [+actions+]\n' +
        '    [+value+]\n' +
        '    <div class="mfjs-items [+items.class+]">\n' +
        '        [+items+]\n' +
        '    </div>\n' +
        '</div>',
  },

  Render: {
    item: function(data, config) {
      let multi = typeof config['multi'] === 'boolean' && config['multi'] && data.name || config['multi'] || '';
      let image = config['image'] || '';

      if (multi) {
        data.attr += ' data-multi="' + multi + '"';
      }

      if (image) {
        data.attr += ' data-image="' + image + '"';
      }

      data.attr += ' style="background-image: url(../' + data.value + ');"';
      data.value = MfJs.Elements['thumb:image'].Render.value(data);

      if (data.items) {
        delete data.items;
      }

      return data;
    },
    value: function(data) {
      return '<div class="mfjs-value" hidden><input type="text" id="mfjs' + data.id + '_value" class="form-control form-control-sm" value="' + MfJs.escape(data.value || '') + '"></div>';
    },
  },

  Actions: {
    default: ['move', 'add', 'hide', 'expand', 'edit', 'del'],
    actions: {
      edit: function(t) {
        let el = t.parentElement.parentElement;
        let valueEl = el.querySelector(':scope > .mfjs-value input');
        if (valueEl) {
          BrowseServer(valueEl.id);
          if (el.dataset['multi']) {
            MfJs.Elements['thumb:image'].MultiBrowseServer(valueEl);
          }
          valueEl.onchange = function(e) {
            el.style.backgroundImage = 'url(\'../' + e.target.value + '\')';
            if (el.dataset.image) {
              [...el.parentElement.querySelectorAll('[data-name="' + el.dataset.image + '"]')].map(function(item) {
                let input = item.querySelector('input[id][name]');
                if (input) {
                  input.value = e.target.value;
                }
              });
            }
          };
        }
      },
    },
  },

  MultiBrowseServer: function(el) {
    MfJs.Elements['thumb:image'].interval = setInterval(function() {
      if (window.KCFinder) {
        clearInterval(MfJs.Elements['thumb:image'].interval);
        window.KCFinder.callBackMultiple = function(files) {
          window.KCFinder = null;
          window.lastFileCtrl = el.id;
          window.SetUrl(files[0]);
          let parent = el.parentElement.parentElement;
          for (let k in files) {
            if (files.hasOwnProperty(k) && parseInt(k)) {
              MfJs.Render.item([MfJs.Config.find(parent.dataset.name)], {}, parent, 2);
              parent = parent.nextElementSibling;
              parent.style.backgroundImage = 'url(\'../' + files[k] + '\')';
              window.lastFileCtrl = parent.querySelector('.mfjs-value > input').id;
              window.SetUrl(files[k]);
            }
          }
        };
      }
    }, 100);
  },
};
