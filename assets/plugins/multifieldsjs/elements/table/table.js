MfJs.add('table', {

  template: '' +
      '<div id="mfjs[+id+]" class="mfjs-row col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+title+]\n' +
      '    [+templates+]\n' +
      '    [+actions+]\n' +
      '    [+value+]\n' +
      '    <div class="mfjs-table-columns row">[+header+]</div>\n' +
      '    <div class="mfjs-items [+items.class+]">\n' +
      '        [+items+]\n' +
      '    </div>\n' +
      '</div>',

  templates: {
    column: '' +
        '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
        '    <input type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" value="[+value+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>\n' +
        '    <div data-mfjs-actions>' +
        '      <i class="mfjs-column-menu-toggle fas fa-angle-down" onclick="MfJs.elements.table.columnMenu(this)"></i>\n' +
        '      [+menu+]\n' +
        '    </div>' +
        '</div>',
    menu: '' +
        '<div class="mfjs-column-menu mfjs-context-menu contextMenu">\n' +
        '    <div onclick="MfJs.elements.table.columnAdd(this);">\n' +
        '        <i class="fa fa-plus fa-fw"></i> Add column\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.elements.table.columnDel(this);">\n' +
        '        <i class="fa fa-minus fa-fw"></i> Delete column\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.elements.table.columnClear(this);">\n' +
        '        <i class="fa fa-eraser fa-fw"></i> Clear column\n' +
        '    </div>\n' +
        '    <div class="separator cntxMnuSeparator"></div>\n' +
        '    [+types+]\n' +
        '</div>',
    menuItem: '<div class="[+selected+]" onclick="MfJs.elements.table.setType(this, \'[+type+]\', \'[+elements+]\');" data-type="[+type+]">[+label+]</div>',
  },

  /**
   *
   * @param t
   */
  columnMenu: function(t) {
    let col = t.parentElement,
        table = col.parentElement.parentElement.parentElement,
        menu = col.querySelector('.mfjs-column-menu');

    table.position = table.getBoundingClientRect();
    col.position = col.getBoundingClientRect();

    if (Math.round(table.position.left) > Math.round(col.position.right - (menu.offsetWidth + 8))) {
      menu.style.right = Math.round(col.position.right - table.position.left - (menu.offsetWidth + 6)) + 'px';
    } else {
      menu.style.right = '';
    }

    menu.classList.toggle('show');
  },

  /**
   *
   * @param t
   */
  columnAdd: function(t) {
    let col = t.closest('[data-type][data-name]'),
        parent = col.parentElement.closest('[data-type][data-name]'),
        items = parent && parent.querySelector(':scope > .mfjs-items') || null;
    if (items) {
      col.insertAdjacentHTML('afterend', col.cloneNode(true).outerHTML.replace(new RegExp(col.id.replace('mfjs', ''), 'g'), MfJs.qid()));
      [...col.parentElement.children].map(function(el, i) {
        el.dataset.name = i.toString();
      });
      [...items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + col.dataset.name + '"]')].map(function(col) {
        let id = MfJs.qid();
        col.insertAdjacentHTML('afterend', col.cloneNode(true).outerHTML.replace(new RegExp(col.id.replace('mfjs', ''), 'g'), id));
        col = col.nextElementSibling;
        if (col.dataset.type === 'thumb:image') {
          col.style.backgroundImage = '';
          col.querySelector('.mfjs-value input').value = '';
        }
        [...col.parentElement.children].map(function(el, i) {
          el.dataset.name = i.toString();
        });
        MfJs.initElements['mfjs' + id] = col.dataset.type;
      });
      MfJs.initElementsInit();
    }
  },

  /**
   *
   * @param t
   */
  columnDel: function(t) {
    let col = t.closest('[data-type][data-name]'),
        parent = col.parentElement.closest('[data-type][data-name]'),
        items = parent && parent.querySelector(':scope > .mfjs-items') || null;
    if (items && col.parentElement.children.length > 1) {
      parent = col.parentElement;
      parent.removeChild(col);
      [...parent.children].map(function(el, i) {
        el.dataset.name = i.toString();
      });
      [...items.querySelectorAll('[data-type][data-name="' + col.dataset.name + '"]')].map(function(col) {
        let parent = col.parentElement;
        parent.removeChild(col);
        [...parent.children].map(function(el, i) {
          el.dataset.name = i.toString();
          if (el.dataset.type === 'id') {
            if (MfJs.elements['id'] && typeof MfJs.elements['id']['initElement'] === 'function') {
              MfJs.elements['id']['initElement'](el.id);
            }
          }
        });
      });
    }
  },

  /**
   *
   * @param t
   */
  columnClear: function(t) {
    let col = t.closest('[data-type][data-name]'),
        parent = col.parentElement.closest('[data-type][data-name]'),
        items = parent && parent.querySelector(':scope > .mfjs-items') || null;
    [...items.querySelectorAll('[data-type][data-name="' + col.dataset.name + '"]')].map(function(col) {
      let input = col.querySelector('[id][name]');
      if (input) {
        switch (input.type) {
          case 'select':
          case 'select-one':
          case 'select-multiple':
            for (let i = 0; i < input.length; i++) {
              if (input[i].selected) {
                input[i].selected = false;
              }
            }
            break;

          case 'radio':
          case 'checkbox':
            input.checked = false;
            break;

          default:
            input.value = '';
            break;
        }
      }
      if (col.dataset.type === 'thumb:image') {
        col.style.backgroundImage = '';
        col.querySelector('.mfjs-value input').value = '';
      }
    });
  },

  /**
   *
   * @param t
   * @param type
   * @param elements
   */
  setType: function(t, type, elements) {
    let col = t.closest('[data-type][data-name]');
    if (col.dataset.type === 'id' && col.parentElement.children.length === 1) {
      return;
    }
    col.dataset.type = type;
    [...col.parentElement.parentElement.querySelectorAll(':scope > .mfjs-items [data-name="' + col.dataset.name + '"]')].map(function(el) {
      let value = el.querySelector('.mfjs-value input') && el.querySelector('.mfjs-value input').value || el.querySelector('[id][name]') && el.querySelector('[id][name]').value || '';
      el.innerHTML = '';
      MfJs.itemRender([
        {
          type: col.dataset.type,
          name: col.dataset.name,
          actions: col.dataset.type === 'thumb:image' ? ['edit'] : false,
          value: value,
          elements: elements || '',
        }], {}, el, 1);
    });
    [...t.parentElement.querySelectorAll('.selected')].map(function(el) {
      el.classList.remove('selected');
    });
    t.classList.add('selected');
    MfJs.initElementsInit();
  },

  /**
   *
   * @param items
   * @returns {any[]}
   */
  getConfigChildren: function(items) {
    items = Object.values(items);
    items.map(function(item) {
      item.value = false;
    });
    return items;
  },

  /**
   *
   * @param data
   * @returns {*}
   */
  itemElements: function(data) {
    if (!data.class) {
      data.class = 'col-12';
    }

    if (data.items && data.types) {
      data.items.map(function(row) {
        row.items.map(function(col) {
          if (col.type) {
            col.attr = '';
            for (let k in data.types) {
              if (data.types.hasOwnProperty(k) && col.type === data.types[k]['type']) {
                if (data.types[k]['elements']) {
                  col.elements = data.types[k]['elements'];
                }
                if (data.types[k]['width']) {
                  col.attr += ' style="max-width:' + data.types[k]['width'] + '"';
                }
              }
            }
          }
        });
      });
    }

    return data;
  },

  /**
   *
   * @param data
   * @param config
   * @returns {*}
   */
  itemConfig: function(data, config) {
    if (data.columns) {
      data.types = config.types || [
        {
          type: 'text',
          label: 'Text',
        },
        {
          type: 'number',
          label: 'Number',
        },
        {
          type: 'date',
          label: 'Date',
        },
        {
          type: 'image',
          label: 'Image',
        },
        {
          type: 'file',
          label: 'File',
        },
      ];

      data['header'] = '';
      data.columns = Object.values(data.columns);
      data.columns.map(function(item, k) {
        item.id = MfJs.qid();
        item.name = k;
        item.type = item.type || 'text';

        let types = '';
        data.types.map(function(col) {
          if (col.type === item.type && col.width) {
            item.attr = ' style="max-width:' + col.width + '"';
          }
          types += MfJs.template(MfJs.elements.table.templates.menuItem, {
            type: col.type || 'text',
            label: col.label || col.type,
            selected: col.type === item.type ? 'selected' : '',
            elements: col.elements || '',
          });
        });

        item.menu = MfJs.template(MfJs.elements.table.templates.menu, {
          types: types,
        });

        data['header'] += MfJs.template(MfJs.elements.table.templates.column, item);
      });

      data.attr += ' data-types="' + MfJs.escape(JSON.stringify(data.types)) + '"';
    }

    data.items = Object.values(data.items || [
      {
        items: data.columns,
      }]);
    data.items.map(function(row) {
      row.name = 'row';
      row.type = 'row';
      row.value = false;
      row.actions = ['add', 'del', 'move'];
      row.attr = 'data-clone="1"';
      if (data['limit.rows']) {
        row.attr += ' data-limit="' + data['limit.rows'] + '"';
      }
      row.items = Object.values(row.items);
      row.items.map(function(item, j) {
        if (item.type === 'thumb:image') {
          item.actions = ['edit'];
        } else {
          item.actions = false;
        }
        if (data.columns && data.columns[j]) {
          item.type = data.columns[j]['type'] || item.type || 'text';
        }
      });
    });

    data.value = MfJs.elements['row'].setValue(data);

    return data;
  },

  /**
   *
   * @param data
   * @param el
   * @param i
   * @returns {{types}|*}
   */
  saveValues: function(data, el, i) {
    let columns = {};
    [...el.querySelectorAll(':scope > .mfjs-table-columns > .col > input[name]')].map(function(input, i) {
      columns[i] = {
        type: input.parentElement.dataset.type,
        value: input.value,
      };
    });

    if (Object.values(columns).length) {
      data.columns = columns;
    }

    data.items = Object.values(data.items);
    data.items.map(function(row) {
      row.name = 'row';
      row.type = 'row';
      row.items = Object.values(row.items);
      row.items.map(function(item) {
        delete item.name;
      });
    });

    if (data.types) {
      data.types = JSON.parse(data.types);
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
});