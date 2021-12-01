/**
 * @version 1.0
 */
MfJs.add('thumb:image', {
  popup: null,
  parent: null,

  actions: ['move', 'add', 'hide', 'expand', 'edit', 'del'],

  template: '' +
      '<div id="mfjs[+id+]" class="mfjs-thumb col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+title+]\n' +
      '    [+actions+]\n' +
      '    [+value+]\n' +
      '    <div class="mfjs-items [+items.class+]">\n' +
      '        [+items+]\n' +
      '    </div>\n' +
      '</div>',

  /**
   *
   * @param t
   */
  actionsEdit: function(t) {
    let el = t.parentElement.parentElement;
    let valueEl = el.querySelector(':scope > .mfjs-value input');
    if (valueEl) {
      BrowseServer(valueEl.id);
      if (el.dataset['multi']) {
        MfJs.elements['thumb:image'].MultiBrowseServer(valueEl);
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

  /**
   *
   * @param el
   * @constructor
   */
  MultiBrowseServer: function(el) {
    MfJs.interval = setInterval(function() {
      if (window.KCFinder) {
        clearInterval(MfJs.interval);
        window.KCFinder.callBackMultiple = function(files) {
          window.KCFinder = null;
          window.lastFileCtrl = el.id;
          window.SetUrl(files[0]);
          let parent = el.parentElement.parentElement;
          for (let k in files) {
            if (files.hasOwnProperty(k) && parseInt(k)) {
              MfJs.itemRender([MfJs.getConfig(parent.dataset.name)], {}, parent, 2);
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

  /**
   *
   * @param data
   * @param config
   * @returns {*}
   */
  itemConfig: function(data, config) {
    let multi = typeof config['multi'] === 'boolean' && config['multi'] && data.name || config['multi'] || '';
    let image = config['image'] || '';

    if (multi) {
      data.attr += ' data-multi="' + multi + '"';
    }

    if (image) {
      data.attr += ' data-image="' + image + '"';
    }

    data.attr += ' style="background-image: url(../' + data.value + ');"';
    data.value = MfJs.elements['thumb'].setValue(data);

    if (data.items) {
      delete data.items;
    }

    return data;
  },

  /**
   *
   * @returns {string}
   * @param data
   */
  setValue: function(data) {
    return '<div class="mfjs-value" hidden><input type="text" id="mfjs' + data.id + '_value" class="form-control form-control-sm" value="' + MfJs.escape(data.value || '') + '"></div>';
  },
});
