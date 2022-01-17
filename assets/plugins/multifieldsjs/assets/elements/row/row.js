/**
 * @version 1.0
 */
MfJs.Elements['row'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="mfjs-row col [+class+]" [+attr+]>\n' +
        '    [+el.title+]\n' +
        '    [+el.templates+]\n' +
        '    [+el.actions+]\n' +
        '    [+el.info+]\n' +
        '    [+el.value+]\n' +
        '    <div class="mfjs-items [+items.class+]"></div>\n' +
        '</div>',
  },

  Render: {
    data: function(data, config) {
      data.el.templates = MfJs.Templates.render(data.templates || []);
      data.el.value = MfJs.Elements.row.Render.value(data);
      data.el.info = MfJs.Elements.row.Render.info(data);

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
    value: function(data) {
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

      return '' +
          '<div class="mfjs-value" ' + hidden + '>' +
          ' <input type="' + type + '" class="form-control form-control-sm" value="' + MfJs.escape(data.value) + '" placeholder="' + (data.placeholder || '') + '" ' + hidden + '>' +
          '</div>';
    },
    info: function(data) {
      let info = '', a;

      a = '';
      for (let k in data) {
        if (k.substr(0, 11) === 'mfjs.offset') {
          let n = k.substr(11) || '';
          a += data[k] && '<div class="mfjs-info-offset' + n + ' mfjs-show-breakpoint' + n + '">offset' + n + ':' + data[k] + '</div>' || '';
        }
      }
      info += '<div class="mfjs-info-offsets">' + a + '</div>';

      a = '';
      for (let k in data) {
        if (k.substr(0, 8) === 'mfjs.col') {
          let n = k.substr(8) || '';
          a += data[k] && '<div class="mfjs-info-col' + n + ' mfjs-show-breakpoint' + n + '">col' + n + ':' + data[k] + '</div>' || '';
        }
      }
      info += '<div class="mfjs-info-cols">' + a + '</div>';

      return '<div class="mfjs-info">' + info + '</div>';
    },
  },

  Actions: {
    default: ['move', 'add', 'hide', 'expand', 'resize', 'del'],
    item: function(action) {
      if (action === 'resize') {
        return '' +
            '<i class="mfjs-actions-' + action + '-offset fa" onmousedown="MfJs.Elements.row.Actions.actions.offset(event);"></i>' +
            '<i class="mfjs-actions-' + action + '-col fa" onmousedown="MfJs.Elements.row.Actions.actions.col(event);"></i>';
      }

      return MfJs.Actions.item(action);
    },
    actions: {
      del: function(t) {
        let el = document.getElementById(t.parentElement.dataset.actions),
            parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates');
        if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) || el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
          if (el) {
            parent = el.parentElement;
            parent.removeChild(el);
            el = parent.querySelector('[data-type="id"]');
            if (el && MfJs.Elements?.id?.Render?.init) {
              MfJs.Elements.id.Render.init(el.id);
            }
          }
        } else {

        }
      },
      offset: function(e) {
        if (e.button) {
          return true;
        }
        window.getSelection().removeAllRanges();
        let parent = e.target.parentElement.parentElement,
            widthCol = parent.parentElement.offsetWidth / 12,
            offset = Math.round(parent.offsetLeft / widthCol),
            className = parent.className = parent.className.replace(/offset-[\d]+/g, '').trim() + (offset && ' offset-' + offset || '') + ' mfjs-active',
            x = e.clientX - parent.offsetLeft,
            info = parent.querySelector(':scope > .mfjs-info .mfjs-info-offsets') || document.createElement('div'),
            breakpoint = MfJs.Container.dataset['mfjsBreakpoint'] || '';

        if (breakpoint) {
          breakpoint = '-' + breakpoint;
        }

        if (!info.classList.contains('mfjs-info-offsets')) {
          info.className = 'mfjs-info-offsets';
          parent.querySelector(':scope > .mfjs-info').appendChild(info);
        }

        parent.setAttribute('data-mfjs-disable-offset', '');

        document.onmousemove = function(e) {
          window.getSelection().removeAllRanges();

          if (breakpoint) {
            if (offset) {
              if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
                info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-offset' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
              }
              info.querySelector('.mfjs-info-offset' + breakpoint).innerHTML = 'offset' + breakpoint + ':' + offset;
            } else if (info.querySelector('.mfjs-info-offset' + breakpoint)) {
              info.removeChild(info.querySelector('.mfjs-info-offset' + breakpoint));
            }
          } else {
            if (offset) {
              if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
                info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-offset' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
              }
              info.querySelector('.mfjs-info-offset').innerHTML = 'offset:' + offset;
            } else if (info.querySelector('.mfjs-info-offset')) {
              info.removeChild(info.querySelector('.mfjs-info-offset'));
            }
          }
          if (Math.round((e.clientX - x) / widthCol) !== offset) {
            offset = Math.round((e.clientX - x) / widthCol);
            if (offset > 11) {
              offset = 11;
            } else if (offset < 1) {
              offset = 0;
            }
            parent.className = className.replace(/offset-[\d]+/g, '').trim() + (offset && ' offset-' + offset || '');
          }
        };

        document.onmouseup = function(e) {
          parent.className = className.replace(/offset-[\d]+/g, '');
          parent.classList.remove('mfjs-active');
          if (offset) {
            parent.classList.add('offset-' + offset);
            parent.setAttribute('data-mfjs-offset' + breakpoint, offset || '');
            if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
              info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-offset' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
            }
            info.querySelector('.mfjs-info-offset' + breakpoint).innerHTML = 'offset' + breakpoint + ':' + offset;
          } else {
            parent.removeAttribute('data-mfjs-offset' + breakpoint);
          }
          [...parent.attributes].forEach(function(attr) {
            if (!offset) {
              if (attr.name.substr(0, 16) === 'data-mfjs-offset' && attr.value === '') {
                parent.removeAttribute(attr.name);
              }
            }
            if (attr.name.substr(0, 17) === 'data-mfjs-offset-' && !MfJs.Config.get('settings')?.toolbar?.breakpoints[attr.name.substr(17)]) {
              parent.removeAttribute(attr.name);
            }
          });
          parent.removeAttribute('data-mfjs-disable-offset');
          document.onmousemove = null;
          e.preventDefault();
          e.stopPropagation();
        };
      },
      col: function(e) {
        if (e.button) {
          return true;
        }
        window.getSelection().removeAllRanges();
        let parent = e.target.parentElement.parentElement,
            widthCol = parent.parentElement.offsetWidth / 12,
            col = Math.round(parent.offsetWidth / widthCol),
            className = parent.className = parent.className.replace(/col-[\d|auto]+/g, '').trim() + (col && ' col-' + col || '') + ' mfjs-active',
            x = e.clientX - parent.offsetWidth,
            info = parent.querySelector(':scope > .mfjs-info .mfjs-info-cols') || document.createElement('div'),
            breakpoint = MfJs.Container.dataset['mfjsBreakpoint'] || '';

        if (breakpoint) {
          breakpoint = '-' + breakpoint;
        }

        if (!info.classList.contains('mfjs-info-cols')) {
          info.className = 'mfjs-info-cols';
          parent.querySelector(':scope > .mfjs-info').appendChild(info);
        }

        parent.setAttribute('data-mfjs-disable-col', '');

        document.onmousemove = function(e) {
          window.getSelection().removeAllRanges();

          if (breakpoint) {
            if (col) {
              if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
                info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-col' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
              }
              info.querySelector('.mfjs-info-col' + breakpoint).innerHTML = 'col' + breakpoint + ':' + col;
            } else if (info.querySelector('.mfjs-info-col' + breakpoint)) {
              info.removeChild(info.querySelector('.mfjs-info-col' + breakpoint));
            }
          } else {
            if (col) {
              if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
                info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-col' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
              }
              info.querySelector('.mfjs-info-col').innerHTML = 'col:' + col;
            } else if (info.querySelector('.mfjs-info-col')) {
              info.removeChild(info.querySelector('.mfjs-info-col'));
            }
          }

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
          parent.className = className.replace(/col-[\d|auto]+/g, '');
          parent.classList.remove('mfjs-active');
          parent.classList.add(col ? 'col-' + col : 'col');
          parent.setAttribute('data-mfjs-col' + breakpoint, col || '');
          if (col) {
            if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
              info.insertAdjacentHTML('beforeend', '<div class="mfjs-info-col' + breakpoint + ' mfjs-show-breakpoint' + breakpoint + '"></div>');
            }
            info.querySelector('.mfjs-info-col' + breakpoint).innerHTML = 'col' + breakpoint + ':' + col;
          }
          [...parent.attributes].forEach(function(attr) {
            if (!col) {
              if (attr.name.substr(0, 13) === 'data-mfjs-col' && attr.value === '') {
                parent.removeAttribute(attr.name);
              }
            }
            if (attr.name.substr(0, 14) === 'data-mfjs-col-' && !MfJs.Config.get('settings')?.toolbar?.breakpoints[attr.name.substr(14)]) {
              parent.removeAttribute(attr.name);
            }
          });
          parent.removeAttribute('data-mfjs-disable-col');
          document.onmousemove = null;
          e.preventDefault();
          e.stopPropagation();
        };
      },
    },
  },
};
