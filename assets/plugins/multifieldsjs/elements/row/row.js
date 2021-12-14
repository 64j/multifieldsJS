/**
 * @version 1.0
 */
MfJs.add('row', {

  actions: ['move', 'add', 'hide', 'expand', 'resize', 'del'],

  template: '' +
      '<div id="mfjs[+id+]" class="mfjs-row col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+title+]\n' +
      '    [+templates+]\n' +
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
  actionsDel: function(t) {
    let el = document.getElementById(t.parentElement.dataset.actions),
        parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates');
    if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) || el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
      if (el) {
        parent = el.parentElement;
        parent.removeChild(el);
        el = parent.querySelector('[data-type="id"]');
        if (el && MfJs.elements['id'] && typeof MfJs.elements['id']['initElement'] === 'function') {
          MfJs.elements['id']['initElement'](el.id);
        }
      }
    } else {

    }
  },

  /**
   *
   * @param e
   * @returns {boolean}
   */
  actionsOffset: function(e) {
    if (e.button) {
      return true;
    }
    window.getSelection().removeAllRanges();
    let parent = e.target.parentElement.parentElement,
        widthCol = parent.parentElement.offsetWidth / 12,
        offset = Math.round(parent.offsetLeft / widthCol),
        className = parent.className = parent.className.replace(/offset-[\d|auto]+/g, '').trim() + (offset && ' offset-' + offset || '') + ' mfjs-active',
        x = e.clientX - parent.offsetLeft,
        helper = parent.querySelector(':scope > .mfjs-helper') || document.createElement('div'),
        breakpoint = MfJs.container.dataset['mfjsBreakpoint'] || '';

    if (breakpoint) {
      breakpoint = '-' + breakpoint;
    }

    if (!helper.classList.contains('mfjs-helper')) {
      helper.className = 'mfjs-helper';
      parent.appendChild(helper);
    }

    parent.setAttribute('data-mfjs-disable-offset', '');

    document.onmousemove = function(e) {
      window.getSelection().removeAllRanges();
      helper.className = 'mfjs-helper show';
      helper.innerHTML = 'offset' + breakpoint + (offset && '-' + offset || '');
      if (Math.round((e.clientX - x) / widthCol) !== offset) {
        offset = Math.round((e.clientX - x) / widthCol);
        if (offset > 11) {
          offset = 12;
        } else if (offset < 1) {
          offset = 0;
        }
        parent.className = className.replace(/offset-[\d|auto]+/g, '').trim() + (offset && ' offset-' + offset || '');
      }
    };

    document.onmouseup = function(e) {
      parent.className = className.replace(/offset-[\d|auto]+/g, '').replace('mfjs-active', '') + (offset && ' offset-' + offset || '');
      if (offset) {
        parent.setAttribute('data-mfjs-offset' + breakpoint, offset || '');
      } else {
        parent.removeAttribute('data-mfjs-offset' + breakpoint);
      }
      [...parent.attributes].map(function(attr) {
        if (attr.name.substr(0, 17) === 'data-mfjs-offset-' && typeof MfJs.config[MfJs.container.dataset['mfjs']].settings?.toolbar.breakpoints[attr.name.substr(17)] === 'undefined') {
          parent.removeAttribute(attr.name);
        }
      });
      parent.removeAttribute('data-mfjs-disable-offset');
      helper.className = 'mfjs-helper';
      document.onmousemove = null;
      e.preventDefault();
      e.stopPropagation();
    };
  },

  /**
   *
   * @param e
   * @returns {boolean}
   */
  actionsCol: function(e) {
    if (e.button) {
      return true;
    }
    window.getSelection().removeAllRanges();
    let parent = e.target.parentElement.parentElement,
        widthCol = parent.parentElement.offsetWidth / 12,
        col = Math.round(parent.offsetWidth / widthCol),
        className = parent.className = parent.className.replace(/col-[\d|auto]+/g, '').trim() + (col && ' col-' + col || '') + ' mfjs-active',
        x = e.clientX - parent.offsetWidth,
        helper = parent.querySelector(':scope > .mfjs-helper') || document.createElement('div'),
        breakpoint = MfJs.container.dataset['mfjsBreakpoint'] || '';

    if (breakpoint) {
      breakpoint = '-' + breakpoint;
    }

    if (!helper.classList.contains('mfjs-helper')) {
      helper.className = 'mfjs-helper';
      parent.appendChild(helper);
    }

    parent.setAttribute('data-mfjs-disable-col', '');

    document.onmousemove = function(e) {
      window.getSelection().removeAllRanges();
      helper.className = 'mfjs-helper show';
      helper.innerHTML = 'col' + breakpoint + (col && '-' + col || '');
      if (Math.ceil((e.clientX - x) / widthCol) !== col) {
        col = Math.ceil((e.clientX - x) / widthCol);
        if (col > 12) {
          col = 0;
        } else if (col < 1) {
          col = 'auto';
        }
        parent.className = className.replace(/col-[\d|auto]+/g, '').trim() + (col && ' col-' + col || '');
      }
    };

    document.onmouseup = function(e) {
      parent.className = className.replace(/col-[\d|auto]+/g, '').replace('mfjs-active', '').trim() + (col ? ' col-' + col : ' col');
      parent.setAttribute('data-mfjs-col' + breakpoint, col || '');
      for (let k in MfJs.config[MfJs.container.dataset['mfjs']].settings?.toolbar.breakpoints) {
        if (MfJs.config[MfJs.container.dataset['mfjs']].settings.toolbar.breakpoints.hasOwnProperty(k)) {
          if (parent.getAttribute('data-mfjs-col' + (k && '-' + k || '')) === null) {
            parent.setAttribute('data-mfjs-col' + (k && '-' + k || ''), '12');
          }
        }
      }
      [...parent.attributes].map(function(attr) {
        if (attr.name.substr(0, 14) === 'data-mfjs-col-' && typeof MfJs.config[MfJs.container.dataset['mfjs']].settings?.toolbar.breakpoints[attr.name.substr(14)] === 'undefined') {
          parent.removeAttribute(attr.name);
        }
      });
      parent.removeAttribute('data-mfjs-disable-col');
      helper.className = 'mfjs-helper';
      document.onmousemove = null;
      e.preventDefault();
      e.stopPropagation();
    };
  },

  /**
   *
   * @param data
   * @returns {*}
   */
  itemConfig: function(data) {
    data.templates = MfJs.getTemplates(data.templates || []);
    data.value = MfJs.elements['row'].setValue(data);

    if (data['mfjs.col']) {
      data.class += ' col-' + data['mfjs.col'];
    }

    if (data['mfjs.offset']) {
      data.class += ' offset-' + data['mfjs.offset'];
    }

    if (!data.class) {
      data.class = 'col-12';
    }

    if (data.templates) {
      data.class += ' mfjs-group';
    }

    return data;
  },

  /**
   *
   * @returns {string}
   * @param data
   */
  setValue: function(data) {
    let hidden = '',
        type = 'text';
    if (typeof data.value === 'boolean') {
      if (!data.value) {
        type = hidden = 'hidden';
      }
      data.value = '';
    } else if (typeof data.value === 'undefined') {
      data.value = '';
    }
    return '<div class="mfjs-value" ' + hidden + '><input type="' + type + '" class="form-control form-control-sm" value="' + MfJs.escape(data.value) + '" placeholder="' + (data.placeholder || '') + '" ' + hidden + '></div>';
  },

  /**
   *
   * @param action
   * @param data
   * @returns {string}
   */
  setAction: function(action, data) {
    if (action === 'resize') {
      return '<i class="mfjs-actions-' + action + '-offset fa" onmousedown="MfJs.elements[\'' + data.type + '\'].actionsOffset(event);"></i><i class="mfjs-actions-' + action + '-col fa" onmousedown="MfJs.elements[\'' + data.type + '\'].actionsCol(event);"></i>';
    }

    return '<i onclick="MfJs.elements[\'' + data.type + '\'].actions' + (action[0].toUpperCase() + action.slice(1)) + '(this);" class="mfjs-actions-' + action + ' fa far"></i>';
  }
});
