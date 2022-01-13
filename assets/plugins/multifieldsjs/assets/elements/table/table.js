/**
 * @version 1.0
 */
MfJs.Elements['table'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="mfjs-row col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
        '    [+title+]\n' +
        '    [+templates+]\n' +
        '    [+actions+]\n' +
        '    [+value+]\n' +
        '    <div class="mfjs-table-columns row">[+header+]</div>\n' +
        '    <div class="mfjs-items [+items.class+]">\n' +
        '        [+items+]\n' +
        '    </div>\n' +
        '</div>',
    value: '' +
        '<div class="mfjs-value" [+hidden+]>\n' +
        '    <input type="[+type+]" class="form-control form-control-sm" value="[+value+]" placeholder="[+placeholder+]" [+hidden+]>\n' +
        '</div>',
    column: '' +
        '<div id="[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
        '    <input type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" value="[+value+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>\n' +
        '    <div data-mfjs-actions>' +
        '      [+menu+]\n' +
        '      <i class="mfjs-column-menu-toggle fas fa-angle-down" onclick="MfJs.Elements.table.Actions.columns.menu(this)"></i>\n' +
        '    </div>' +
        '</div>',
    menu: '' +
        '<div class="mfjs-column-menu mfjs-context-menu contextMenu">\n' +
        '    <div class="separator cntxMnuSeparator">[+lang.actionsHeader+]</div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.addAfter(this);">\n' +
        '        <i class="fa fa-share fa-fw"></i> [+lang.actions.addAfter+]\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.addBefore(this);">\n' +
        '        <i class="fa fa-reply fa-fw"></i> [+lang.actions.addBefore+]\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.moveRight(this);">\n' +
        '        <i class="fa fa-arrow-right fa-fw"></i> [+lang.actions.moveRight+]\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.moveLeft(this);">\n' +
        '        <i class="fa fa-arrow-left fa-fw"></i> [+lang.actions.moveLeft+]\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.clear(this);">\n' +
        '        <i class="fa fa-eraser fa-fw"></i> [+lang.actions.clear+]\n' +
        '    </div>\n' +
        '    <div onclick="MfJs.Elements.table.Actions.columns.del(this);">\n' +
        '        <i class="fa fa-minus-circle fa-fw text-danger"></i> [+lang.actions.del+]\n' +
        '    </div>\n' +
        '    <div class="separator cntxMnuSeparator">[+lang.typesHeader+]</div>\n' +
        '    [+types+]\n' +
        '</div>',
    menuItem: '<div class="[+selected+]" onclick="MfJs.Elements.table.Actions.columns.type(this, \'[+type+]\', \'[+elements+]\');" data-type="[+type+]">[+label+]</div>',
  },

  values: function(data, el, i) {
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
      row.name = data.name + ':row';
      row.type = 'row';
      row.items = Object.values(row.items || {});
      row.items.map(function(item) {
        delete item.name;
      });
    });

    if (data.types) {
      delete data.types;
    }

    return data;
  },

  Render: {
    item: function(data, config) {
      if (data.columns) {
        if (typeof config.types === 'string') {
          config.types = JSON.parse(config.types);
        }
        data.types = config.types || [
          {
            type: 'id',
            label: MfJs.Elements.table.Lang.menu.types.id,
          },
          {
            type: 'text',
            label: MfJs.Elements.table.Lang.menu.types.text,
          },
          {
            type: 'number',
            label: MfJs.Elements.table.Lang.menu.types.number,
          },
          {
            type: 'date',
            label: MfJs.Elements.table.Lang.menu.types.date,
          },
          {
            type: 'image',
            label: MfJs.Elements.table.Lang.menu.types.image,
          },
          {
            type: 'thumb:image',
            label: MfJs.Elements.table.Lang.menu.types.thumbImage,
          },
          {
            type: 'file',
            label: MfJs.Elements.table.Lang.menu.types.file,
          },
        ];

        data.header = '';
        data.columns = Object.values(data.columns);
        data.columns.map(function(item, k) {
          item.id = MfJs.qid('mfjs');
          item.name = k;
          item.type = item.type || 'text';

          let types = '';
          data.types.map(function(col) {
            if (col.type === item.type && col.width) {
              item.attr = ' style="max-width:' + col.width + '"';
            }
            types += MfJs.Render.template(MfJs.Elements.table.templates.menuItem, {
              type: col.type || 'text',
              label: col.label || col.type,
              selected: col.type === item.type ? 'selected' : '',
              elements: col.elements || '',
            });
          });

          item.menu = MfJs.Render.template(MfJs.Elements.table.templates.menu, {
            types: types,
            lang: MfJs.Elements.table.Lang.menu,
          });

          data.header += MfJs.Render.template(MfJs.Elements.table.templates.column, item);
        });

        data.attr += ' data-types="' + MfJs.escape(JSON.stringify(data.types)) + '"';
      }

      data.items = Object.values(data.items || [
        {
          items: data.columns,
        },
      ]);

      if (data.items.length) {
        if (!data.items[0].type || data.items[0].type === 'table:row' || data.items[0].type === 'row') {
          data.items.map(function(row) {
            row.name = data.name + ':row';
            row.type = 'row';
            row.value = false;
            row.actions = ['add', 'del', 'move'];
            row.attr = 'data-clone="1"' + (data['limit.rows'] ? ' data-limit="' + data['limit.rows'] + '"' : '');
            row.items = row.items.map(function(item, j) {
              item.actions = item.type === 'thumb:image' ? ['edit', 'del'] : false;
              item.attr = item.type === 'thumb:image' ? 'data-clone="1"' : '';
              if (data?.columns?.[j]) {
                item.type = data.columns[j]['type'] || item.type || 'text';
              }
              return item;
            });
          });
        } else {
          data.items = [
            {
              name: data.name + ':row',
              type: 'row',
              value: false,
              actions: ['add', 'del', 'move'],
              attr: 'data-clone="1"' + (data['limit.rows'] ? ' data-limit="' + data['limit.rows'] + '"' : ''),
              items: data.items.map(function(item, j) {
                item.actions = item.type === 'thumb:image' ? ['edit', 'del'] : false;
                item.attr += item.type === 'thumb:image' ? 'data-clone="1"' : '';
                if (data?.columns?.[j]) {
                  item.type = data.columns[j]['type'] || item.type || 'text';
                }
                return item;
              }),
            },
          ];
        }
      }

      data.value = MfJs.Elements.row.Render.value(data);

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
      return MfJs.Render.template(MfJs.Elements.table.templates.value, {
        type: type,
        value: MfJs.escape(data.value),
        placeholder: data.placeholder || '',
        hidden: hidden,
      });
    },
    elements: function(data) {
      if (!data.class) {
        data.class = 'col-12';
      }

      if (data.items && data.types) {
        data.items.map(function(row) {
          row.items.map(function(col) {
            if (col.type) {
              col.attr = '';
              for (let k in data.types) {
                if (col.type === data.types[k].type) {
                  if (data.types[k].elements) {
                    col.elements = data.types[k].elements;
                  }
                  if (data.types[k].width) {
                    col.attr += ' style="max-width:' + data.types[k].width + '"';
                  }
                }
              }
            }
          });
        });
      }

      return data;
    },
  },

  Config: {
    findChildren: function(items) {
      items = Object.values(items);
      items.map(function(item) {
        item.value = false;
      });
      return items;
    },
  },

  Actions: {
    columns: {
      menu: function(t) {
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
      addBefore: function(t) {
        let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null;
        if (items) {
          col.insertAdjacentHTML('beforebegin', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), MfJs.qid('mfjs')));
          [...col.parentElement.children].map(function(el, i) {
            el.dataset.name = i.toString();
          });
          col.previousElementSibling.querySelector('input').value = '';
          [...items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]')].map(function(col) {
            let id = MfJs.qid('mfjs');
            col.insertAdjacentHTML('beforebegin', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), id));
            col = col.previousElementSibling;
            if (col.dataset.type === 'thumb:image') {
              col.style.backgroundImage = '';
              col.querySelector('.mfjs-value input').value = '';
            }
            [...col.parentElement.children].map(function(el, i) {
              el.dataset.name = i.toString();
            });
            MfJs.Render.addInit(id, col.dataset.type);
          });
          MfJs.Elements.table.Actions.columns.clear(col.previousElementSibling.querySelector('.mfjs-column-menu > div'));
          MfJs.Render.init();
        }
      },
      addAfter: function(t) {
        let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null;
        if (items) {
          col.insertAdjacentHTML('afterend', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), MfJs.qid('mfjs')));
          [...col.parentElement.children].map(function(el, i) {
            el.dataset.name = i.toString();
          });
          col.nextElementSibling.querySelector('input').value = '';
          [...items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]')].map(function(col) {
            let id = MfJs.qid('mfjs');
            col.insertAdjacentHTML('afterend', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), id));
            col = col.nextElementSibling;
            if (col.dataset.type === 'thumb:image') {
              col.style.backgroundImage = '';
              col.querySelector('.mfjs-value input').value = '';
            }
            [...col.parentElement.children].map(function(el, i) {
              el.dataset.name = i.toString();
            });
            MfJs.Render.addInit(id, col.dataset.type);
          });
          MfJs.Elements.table.Actions.columns.clear(col.nextElementSibling.querySelector('.mfjs-column-menu > div'));
          MfJs.Render.init();
        }
      },
      moveLeft: function(t) {
        let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null;
        if (items && col.previousElementSibling) {
          col.previousElementSibling.insertAdjacentElement('beforebegin', col);
          [...col.parentElement.children].map(function(el, i) {
            el.dataset.name = i.toString();
          });
          [...items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]')].map(function(col) {
            col.previousElementSibling.insertAdjacentElement('beforebegin', col);
            [...col.parentElement.children].map(function(el, i) {
              el.dataset.name = i.toString();
            });
          });
        }
      },
      moveRight: function(t) {
        let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null;
        if (items && col.nextElementSibling) {
          col.nextElementSibling.insertAdjacentElement('afterend', col);
          [...col.parentElement.children].map(function(el, i) {
            el.dataset.name = i.toString();
          });
          [...items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]')].map(function(col) {
            col.nextElementSibling.insertAdjacentElement('afterend', col);
            [...col.parentElement.children].map(function(el, i) {
              el.dataset.name = i.toString();
            });
          });
        }
      },
      del: function(t) {
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
              if (MfJs.Elements?.[el.dataset.type]?.Render?.init) {
                MfJs.Elements[el.dataset.type].Render.init(el.id);
              }
            });
          });
        }
      },
      clear: function(t) {
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
      type: function(t, type, elements) {
        let col = t.closest('[data-type][data-name]');
        if (col.dataset.type === 'id' && col.parentElement.children.length === 1) {
          return;
        }
        col.dataset.type = type;
        [...col.parentElement.parentElement.querySelectorAll(':scope > .mfjs-items [data-name="' + col.dataset.name + '"]')].map(function(el) {
          let value = el.querySelector('.mfjs-value input') && el.querySelector('.mfjs-value input').value || el.querySelector('[id][name]') && el.querySelector('[id][name]').value || '';
          el.innerHTML = '';
          MfJs.Render.render([
            {
              type: col.dataset.type,
              name: col.dataset.name,
              actions: col.dataset.type === 'thumb:image' ? ['edit', 'del'] : false,
              attr: col.dataset.type === 'thumb:image' ? 'data-clone="1"' : '',
              value: value,
              elements: elements || '',
            }], {}, el, 1);
        });
        [...t.parentElement.querySelectorAll('.selected')].map(function(el) {
          el.classList.remove('selected');
        });
        t.classList.add('selected');
        MfJs.Render.init();
      },
    },
  },
};
