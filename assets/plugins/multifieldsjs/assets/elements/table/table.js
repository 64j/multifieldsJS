/**
 * @version 1.0
 */
MfJs.Elements['table'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="mfjs-row col {{ class }}" {{ attr }}>
    {{ el.title }}
    {{ el.templates }}
    {{ el.actions }}
    {{ el.value }}
    {{ el.columns }}
    <div class="mfjs-items {{ items.class }}"></div>
</div>`,
    value: `
<div class="mfjs-value" {{ hidden }}>
    <input type="{{ type }}" class="form-control form-control-sm" value="{{ value }}" placeholder="{{ placeholder }}"
           oninput="MfJs.Elements.table.Actions.actions.title(this);" {{ hidden }}>
</div>`,
    columns: `<div class="mfjs-table-columns row">{{ items }}</div>`,
    column: `
<div id="{{ id }}" class="col {{ class }}" data-type="{{ type }}" data-name="{{ name }}" {{ attr }}>
    <input type="text" id="tv{{ id }}" class="form-control {{ item.class }}" name="tv{{ id }}" value="{{ value }}"
           placeholder="{{ placeholder }}" onchange="documentDirty=true;" {{ item.attr }}>
    <div data-mfjs-actions> {{ menu }}
        <i class="mfjs-column-menu-toggle fas fa-angle-down"
           onclick="MfJs.Elements.table.Actions.actions.columns.menu(this)"></i>
    </div>
</div>`,
    menu: `
<div class="mfjs-column-menu mfjs-context-menu contextMenu">
    <div class="separator cntxMnuSeparator">{{ lang.actionsHeader }}</div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.addAfter(this);">
        <i class="fa fa-share fa-fw"></i> {{ lang.actions.addAfter }}
    </div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.addBefore(this);">
        <i class="fa fa-reply fa-fw"></i> {{ lang.actions.addBefore }}
    </div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.moveRight(this);">
        <i class="fa fa-arrow-right fa-fw"></i> {{ lang.actions.moveRight }}
    </div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.moveLeft(this);">
        <i class="fa fa-arrow-left fa-fw"></i> {{ lang.actions.moveLeft }}
    </div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.clear(this);">
        <i class="fa fa-eraser fa-fw"></i> {{ lang.actions.clear }}
    </div>
    <div onclick="MfJs.Elements.table.Actions.actions.columns.del(this);">
        <i class="fa fa-minus-circle fa-fw text-danger"></i> {{ lang.actions.del }}
    </div>
    <div class="separator cntxMnuSeparator">{{ lang.typesHeader }}</div>
    {{ types }}
</div>`,
    menuItem: `
<div class="{{ selected }}"
     onclick="MfJs.Elements.table.Actions.actions.columns.type(this, '{{ type }}', '{{ elements }}');"
     data-type="{{ type }}">
    {{ label }}
</div>`,
  },

  values (data, el, i) {
    let columns = {}

    el.querySelectorAll(':scope > .mfjs-table-columns > .col > input[name]').forEach((input, i) => {
      columns[i] = {
        type: input.parentElement.dataset.type,
        value: input.value,
      }
    })

    if (Object.values(columns).length) {
      data.columns = columns
    }

    data.items = Object.values(data.items)

    data.items.forEach(row => {
      row.name = data.name + ':row'
      row.type = 'row'
      row.items = Object.values(row.items || {})
      row.items.forEach(item => {
        delete item.name
      })
    })

    if (data.types) {
      delete data.types
    }

    return data
  },

  Render: {
    data (data, config) {
      if (!data.class) {
        data.class = 'col-12'
      }

      if (data.title && config.title && data.value !== '') {
        data.title = config.title + ':' + data.value
      }

      if (data.columns) {
        if (typeof config.types === 'string') {
          config.types = JSON.parse(config.types)
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
        ]

        data.el.columns = ''
        data.columns = Object.values(data.columns)
        data.columns.forEach((item, k) => {
          item.id = MfJs.qid('mfjs')
          item.name = k
          item.type = item.type || 'text'

          let types = ''
          data.types.forEach(col => {
            if (col.type === item.type && col.width) {
              item.attr = ' style="max-width:' + col.width + '"'
            }
            types += MfJs.Render.template(['table', 'menuItem'], {
              type: col.type || 'text',
              label: col.label || col.type,
              selected: col.type === item.type ? 'selected' : '',
              elements: col.elements || '',
            })
          })

          item.menu = MfJs.Render.template(['table', 'menu'], {
            types: types,
            lang: MfJs.Elements.table.Lang.menu,
          })

          data.el.columns += MfJs.Render.template(['table', 'column'], item)
        })

        if (data.el.columns) {
          data.el.columns = MfJs.Render.template(['table', 'columns'], {
            items: data.el.columns,
          })
        }

        data.attr += ' data-types="' + MfJs.escape(JSON.stringify(data.types)) + '"'
      }

      data.items = Object.values(data.items || [
        {
          items: data.columns,
        },
      ])

      if (data.items.length) {
        if (!data.items[0].type || data.items[0].type === 'table:row' || data.items[0].type === 'row') {
          data.items.forEach(row => {
            row.name = data.name + ':row'
            row.type = 'row'
            row.value = false
            row.actions = ['add', 'del', 'move']
            row.clone = 1
            row.attr = (data['limit.rows'] ? ' data-limit="' + data['limit.rows'] + '"' : '')
            row.items = row.items.map((item, j) => {
              item.actions = false
              if (item.type === 'thumb:image') {
                item.actions = ['edit', 'del']
                item.clone = 1
              }
              if (data?.columns?.[j]) {
                item.type = data.columns[j]['type'] || item.type || 'text'
              }
              return item
            })
          })
        } else {
          data.items = [
            {
              name: data.name + ':row',
              type: 'row',
              value: false,
              actions: ['add', 'del', 'move'],
              clone: 1,
              attr: (data['limit.rows'] ? ' data-limit="' + data['limit.rows'] + '"' : ''),
              items: data.items.map((item, j) => {
                item.actions = false
                if (item.type === 'thumb:image') {
                  item.actions = ['edit', 'del']
                  item.clone = 1
                }
                if (data?.columns?.[j]) {
                  item.type = data.columns[j]['type'] || item.type || 'text'
                }
                return item
              }),
            },
          ]
        }
      }

      if (data.items && data.types) {
        data.items.forEach(row => {
          row.items.forEach(col => {
            if (col.type) {
              col.attr = ''

              for (let k in data.types) {
                if (col.type === data.types[k].type) {
                  if (data.types[k].elements) {
                    col.elements = data.types[k].elements
                  }

                  if (data.types[k].width) {
                    col.attr += ' style="max-width:' + data.types[k].width + '"'
                  }
                }
              }
            }
          })
        })
      }

      data.el.value = MfJs.Elements.table.Render.value(data)

      return data
    },
    value (data) {
      let hidden = '',
        type = 'text'

      if (typeof data.value === 'boolean') {
        if (!data.value) {
          type = hidden = 'hidden'
        }

        data.value = ''
      } else if (typeof data.value === 'undefined') {
        data.value = ''
      }

      return MfJs.Render.template(['table', 'value'], {
        type: type,
        value: MfJs.escape(data.value),
        placeholder: data.placeholder || '',
        hidden: hidden,
      })
    },
  },

  Config: {
    findChildren (items) {
      items = Object.values(items)

      items.forEach(item => {
        item.value = false
      })

      return items
    },
  },

  Actions: {
    actions: {
      columns: {
        menu (t) {
          let col = t.parentElement,
            table = col.parentElement.parentElement.parentElement,
            menu = col.querySelector('.mfjs-column-menu')

          if (menu.classList.contains('show')) {
            menu.classList.remove('show')
          } else {
            table.position = table.getBoundingClientRect()
            col.position = col.getBoundingClientRect()

            if (table.position.left > col.position.left + col.offsetWidth - menu.offsetWidth - 20) {
              menu.style.right = -menu.offsetWidth + 'px'
            } else {
              menu.style.right = ''
            }

            menu.height = 0
            for (let i = 0; i < menu.children.length; i++) {
              menu.height += menu.children[i].offsetHeight
            }

            if (menu.height + col.position.top > window.innerHeight) {
              menu.style.top = window.innerHeight - col.position.top - menu.height + 'px'
            } else {
              menu.style.top = '0'
            }

            menu.classList.add('show')
          }
        },
        addBefore (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          if (items) {
            col.insertAdjacentHTML('beforebegin', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), MfJs.qid('mfjs')));

            [...col.parentElement.children].forEach((el, i) => {
              el.dataset.name = i.toString()
            })

            col.previousElementSibling.querySelector('input').value = ''

            items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]').forEach(col => {
              let id = MfJs.qid('mfjs')
              col.insertAdjacentHTML('beforebegin', col.cloneNode(true)['outerHTML'].replace(new RegExp(col.id, 'g'), id))
              col = col.previousElementSibling
              if (col.dataset.type === 'thumb:image') {
                col.style.backgroundImage = ''
                col.querySelector('.mfjs-value input').value = ''
              }
              [...col.parentElement.children].forEach((el, i) => {
                el.dataset.name = i.toString()
              })
              MfJs.Render.addInit(id, col.dataset.type)
            })

            MfJs.Elements.table.Actions.actions.columns.clear(col.previousElementSibling.querySelector('.mfjs-column-menu > div'))
            MfJs.Render.init()
          }
        },
        addAfter (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          if (items) {
            col.insertAdjacentHTML('afterend', col.cloneNode(true).outerHTML.replace(new RegExp(col.id, 'g'), MfJs.qid('mfjs')));

            [...col.parentElement.children].forEach((el, i) => {
              el.dataset.name = i.toString()
            })

            col.nextElementSibling.querySelector('input').value = ''

            items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]').forEach(col => {
              let id = MfJs.qid('mfjs')
              col.insertAdjacentHTML('afterend', col.cloneNode(true)['outerHTML'].replace(new RegExp(col.id, 'g'), id))
              col = col.nextElementSibling
              if (col.dataset.type === 'thumb:image') {
                col.style.backgroundImage = ''
                col.querySelector('.mfjs-value input').value = ''
              }
              [...col.parentElement.children].forEach((el, i) => {
                el.dataset.name = i.toString()
              })
              MfJs.Render.addInit(id, col.dataset.type)
            })

            MfJs.Elements.table.Actions.actions.columns.clear(col.nextElementSibling.querySelector('.mfjs-column-menu > div'))
            MfJs.Render.init()
          }
        },
        moveLeft (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          if (items && col.previousElementSibling) {
            col.previousElementSibling.insertAdjacentElement('beforebegin', col);

            [...col.parentElement.children].forEach((el, i) => {
              el.dataset.name = i.toString()
            })

            items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]').forEach(col => {
              col.previousElementSibling.insertAdjacentElement('beforebegin', col);
              [...col.parentElement.children].forEach((el, i) => {
                el.dataset.name = i.toString()
              })
            })
          }
        },
        moveRight (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          if (items && col.nextElementSibling) {
            col.nextElementSibling.insertAdjacentElement('afterend', col);

            [...col.parentElement.children].forEach((el, i) => {
              el.dataset.name = i.toString()
            })

            items.querySelectorAll(':scope > .mfjs-row > .mfjs-items > [data-type][data-name="' + name + '"]').forEach(col => {
              col.nextElementSibling.insertAdjacentElement('afterend', col);
              [...col.parentElement.children].forEach((el, i) => {
                el.dataset.name = i.toString()
              })
            })
          }
        },
        del (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          if (items && col.parentElement.children.length > 1) {
            parent = col.parentElement
            parent.removeChild(col);

            [...parent.children].forEach((el, i) => {
              el.dataset.name = i.toString()
            })

            items.querySelectorAll('[data-type][data-name="' + name + '"]').forEach(col => {
              let parent = col.parentElement
              parent.removeChild(col);
              [...parent.children].forEach((el, i) => {
                el.dataset.name = i.toString()
                if (MfJs.Elements?.[el.dataset.type]?.Render?.init) {
                  MfJs.Elements[el.dataset.type].Render.init(el.id)
                }
              })
            })
          }
        },
        clear (t) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name,
            parent = col.parentElement.closest('[data-type][data-name]'),
            items = parent && parent.querySelector(':scope > .mfjs-items') || null

          items.querySelectorAll('[data-type][data-name="' + name + '"]').forEach(col => {
            let input = col.querySelector('[id][name]')

            if (input) {
              switch (input.type) {
                case 'select':
                case 'select-one':
                case 'select-multiple':
                  for (let i = 0; i < input.length; i++) {
                    if (input[i].selected) {
                      input[i].selected = false
                    }
                  }
                  break

                case 'radio':
                case 'checkbox':
                  input.checked = false
                  break

                default:
                  input.value = ''
                  break
              }
            }

            if (col.dataset.type === 'thumb:image') {
              col.style.backgroundImage = ''
              col.querySelector('.mfjs-value input').value = ''
            }
          })
        },
        type (t, type, elements) {
          let col = t.closest('[data-type][data-name]'),
            name = col.dataset.name

          if (col.dataset.type === 'id' && col.parentElement.children.length === 1) {
            return
          }

          col.dataset.type = type

          col.parentElement.parentElement.querySelectorAll(':scope > .mfjs-items [data-name="' + name + '"]').forEach(el => {
            let value = el.querySelector('.mfjs-value input') && el.querySelector('.mfjs-value input').value || el.querySelector('[id][name]') && el.querySelector('[id][name]').value || ''

            el.innerHTML = ''

            let item = {
              type: type,
              name: name,
              value: value,
              elements: elements || '',
              actions: false,
            }

            if (item.type === 'thumb:image') {
              item.actions = ['edit', 'del']
              item.clone = 1
            }

            MfJs.Render.render([item], {}, el, 1)
          })

          t.parentElement.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected')
          })

          t.classList.add('selected')
          MfJs.Render.init()
        },
      },
      title (t) {
        let parent = t.parentElement.parentElement,
          title = parent.querySelector(':scope > .mfjs-title')
        if (title) {
          let value = t.value !== '' && ':' + t.value || ''
          parent.dataset.title = parent.dataset.titleOriginal + value
          title.innerHTML = parent.dataset.titleOriginal + value
        }
      },
    },
  },
}
