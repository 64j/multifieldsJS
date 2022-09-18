/**
 * @version 1.0
 */
MfJs.Elements['row'] = {
  parent: null,

  templates: {
    wrapper: `
<div id="{{ id }}" class="mfjs-row col {{ class }}" {{ attr }}>
    {{ el.title }}
    {{ el.templates }}
    {{ el.actions }}
    {{ el.info }}
    {{ el.value }}
    <div class="mfjs-items {{ items.class }}"></div>
</div>`,
    value: `
<div class="mfjs-value" {{ hidden }}>
    <input type="{{ type }}" 
           class="form-control form-control-sm" 
           value="{{ value }}" 
           placeholder="{{ placeholder }}"
           {{ hidden }}>
</div>`
  },

  Render: {
    data (data, config) {
      data.el.templates = MfJs.Templates.render(data.templates || [])
      data.el.value = MfJs.Elements.row.Render.value(data)
      data.el.info = MfJs.Elements.row.Render.info(data)

      if (data['mf.col']) {
        data.class += ' col-' + data['mf.col']
      }

      if (data['mf.offset']) {
        data.class += ' offset-' + data['mf.offset']
      }

      if (!data.class) {
        data.class = 'col-12'
      }

      if (data.templates) {
        data.class += ' mfjs-group'
      }

      if (data.popup) {
        data.attr += ' data-mf-popup="' + MfJs.escape(JSON.stringify(data.popup)) + '"'
      }

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

      return MfJs.Render.template([data.type, 'value'], {
        type: type,
        value: MfJs.escape(data.value),
        hidden: hidden,
        placeholder: data.placeholder || ''
      })
    },
    info (data) {
      let info = '', a

      a = ''
      for (let k in data) {
        if (k.substring(0, 9) === 'mf.offset') {
          let n = k.substring(9) || ''
          a += data[k] && `<div class="mfjs-info-offset${n} mfjs-show-breakpoint${n}">offset${n}:${data[k]}</div>` || ''
        }
      }
      info += `<div class="mfjs-info-offsets">${a}</div>`

      a = ''
      for (let k in data) {
        if (k.substring(0, 6) === 'mf.col') {
          let n = k.substring(6) || ''
          a += data[k] && `<div class="mfjs-info-col${n} mfjs-show-breakpoint${n}">col${n}:${data[k]}</div>` || ''
        }
      }
      info += `<div class="mfjs-info-cols">${a}</div>`

      return `<div class="mfjs-info">${info}</div>`
    }
  },

  Actions: {
    default: ['move', 'add', 'hide', 'expand', 'resize', 'edit', 'del'],
    hidden: ['edit'],
    item (action, data) {
      if (action === 'resize') {
        return `
          <i class="mfjs-actions-${action}-offset fa" onmousedown="MfJs.Elements.row.Actions.actions.offset(event);"></i>
          <i class="mfjs-actions-${action}-col fa" onmousedown="MfJs.Elements.row.Actions.actions.col(event);"></i>`
      }

      if (action === 'edit') {
        data.attr += ' data-mf-expand="1"'
      }

      return MfJs.Actions.item(action)
    },
    actions: {
      del (t) {
        let el = document.getElementById(t.parentElement.dataset.actions),
          parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates')
        if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) ||
          el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
          if (el) {
            parent = el.parentElement
            parent.removeChild(el)
            el = parent.querySelector('[data-type="id"]')
            if (el && MfJs.Elements?.id?.Render?.init) {
              MfJs.Elements.id.Render.init(el.id)
            }
          }
        } else {

        }
      },
      edit (t) {
        let Row = this
        Row.parent = t.parentElement.parentElement
        Row.clone = Row.parent.querySelector(':scope > .mfjs-items').cloneNode(true)

        MfJs.popup(Object.assign({
          title: Row.parent.querySelector('.mfjs-title') && Row.parent.querySelector('.mfjs-title').innerHTML ||
            Row.parent.dataset.type,
          content: `<div class="mfjs"><div class="mfjs-items"></div></div>`,
          onload (popup, el) {
            el.querySelector('.mfjs .mfjs-items').append(...Row.parent.querySelector(':scope > .mfjs-items').children)

            el.addEventListener('click', function (e) {
              if (e.target.classList.contains('mfjs-save')) {
                this.classList.remove('show')
                documentDirty = true
                this.querySelectorAll('.mfjs-items [data-thumb]').forEach(el => {
                  let value = el.querySelector('input').value
                  if (el.dataset['thumb'] === Row.parent.dataset['name']) {
                    Row.parent.querySelector(':scope > .mfjs-value input').value = value
                    Row.parent.style.backgroundImage = 'url(\'../' + value + '\')'
                  } else {
                    let thumbs = el.dataset['thumb'].toString().split(',')
                    for (let k in thumbs) {
                      if (thumbs.hasOwnProperty(k) && Row.parent.dataset['name'] === thumbs[k]) {
                        Row.parent.style.backgroundImage = 'url(\'../' + value + '\')'
                        let input = Row.parent.querySelector(':scope > .mfjs-value input')
                        if (input) {
                          input.value = value
                        }
                        break
                      }
                    }
                  }
                })
                Row.parent.querySelector('.mfjs-items').append(...this.querySelector('.mfjs-items').children)
                popup.close()
              }
              if (e.target.classList.contains('mfjs-close')) {
                popup.close()
              }
            })

            MfJs.sortable(el.querySelectorAll('.mfjs .mfjs-items'))
          },
          onclose () {
            let items = Row.parent.querySelector('.mfjs-items')
            if (!items.childElementCount) {
              items.append(...Row.clone.children)
            }
          }
        }, Row.parent.dataset.mfPopup ? JSON.parse(Row.parent.dataset.mfPopup) : {}))
      },
      offset (e) {
        if (e.button) {
          return true
        }
        window.getSelection().removeAllRanges()
        let parent = e.target.parentElement.parentElement,
          widthCol = parent.parentElement.offsetWidth / 12,
          offset = Math.round(parent.offsetLeft / widthCol),
          className = parent.className = parent.className.replace(/offset-\d+/g, '').trim() +
            (offset && ' offset-' + offset || '') + ' mfjs-active',
          x = e.clientX - parent.offsetLeft,
          info = parent.querySelector(':scope > .mfjs-info .mfjs-info-offsets') || document.createElement('div'),
          breakpoint = MfJs.Container.dataset['mfjsBreakpoint'] || ''

        if (breakpoint) {
          breakpoint = '-' + breakpoint
        }

        if (!info.classList.contains('mfjs-info-offsets')) {
          info.className = 'mfjs-info-offsets'
          parent.querySelector(':scope > .mfjs-info').appendChild(info)
        }

        parent.setAttribute('data-mf-disable-offset', '')

        document.onmousemove = (e) => {
          window.getSelection().removeAllRanges()

          if (breakpoint) {
            if (offset) {
              if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
                info.insertAdjacentHTML('beforeend',
                  `<div class="mfjs-info-offset${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`)
              }
              info.querySelector('.mfjs-info-offset' + breakpoint).innerHTML = 'offset' + breakpoint + ':' + offset
            } else if (info.querySelector('.mfjs-info-offset' + breakpoint)) {
              info.removeChild(info.querySelector('.mfjs-info-offset' + breakpoint))
            }
          } else {
            if (offset) {
              if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
                info.insertAdjacentHTML('beforeend',
                  `<div class="mfjs-info-offset${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`
                )
              }
              info.querySelector('.mfjs-info-offset').innerHTML = 'offset:' + offset
            } else if (info.querySelector('.mfjs-info-offset')) {
              info.removeChild(info.querySelector('.mfjs-info-offset'))
            }
          }
          if (Math.round((e.clientX - x) / widthCol) !== offset) {
            offset = Math.round((e.clientX - x) / widthCol)
            if (offset > 11) {
              offset = 11
            } else if (offset < 1) {
              offset = 0
            }
            parent.className = className.replace(/offset-\d+/g, '').trim() + (offset && ' offset-' + offset || '')
          }
        }

        document.onmouseup = (e) => {
          parent.className = className.replace(/offset-\d+/g, '')
          parent.classList.remove('mfjs-active')
          if (offset) {
            parent.classList.add('offset-' + offset)
            parent.setAttribute('data-mf-offset' + breakpoint, offset || '')
            if (!info.querySelector('.mfjs-info-offset' + breakpoint)) {
              info.insertAdjacentHTML('beforeend',
                `<div class="mfjs-info-offset${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`)
            }
            info.querySelector('.mfjs-info-offset' + breakpoint).innerHTML = 'offset' + breakpoint + ':' + offset
          } else {
            parent.removeAttribute('data-mf-offset' + breakpoint)
          }
          [...parent.attributes].forEach(attr => {
            if (!offset) {
              if (attr.name.substring(0, 14) === 'data-mf-offset' && attr.value === '') {
                parent.removeAttribute(attr.name)
              }
            }
            if (attr.name.substring(0, 15) === 'data-mf-offset-' &&
              !MfJs.Config.get('settings')?.toolbar?.breakpoints[attr.name.substring(15)]) {
              parent.removeAttribute(attr.name)
            }
          })
          parent.removeAttribute('data-mf-disable-offset')
          document.onmousemove = null
          e.preventDefault()
          e.stopPropagation()
        }
      },
      col (e) {
        if (e.button) {
          return true
        }
        window.getSelection().removeAllRanges()
        let parent = e.target.parentElement.parentElement,
          widthCol = parent.parentElement.offsetWidth / 12,
          col = Math.round(parent.offsetWidth / widthCol),
          className = parent.className = parent.className.replace(/col-[\d|auto]+/g, '').trim() +
            (col && ' col-' + col || '') + ' mfjs-active',
          x = e.clientX - parent.offsetWidth,
          info = parent.querySelector(':scope > .mfjs-info .mfjs-info-cols') || document.createElement('div'),
          breakpoint = MfJs.Container.dataset['mfjsBreakpoint'] || ''

        if (breakpoint) {
          breakpoint = '-' + breakpoint
        }

        if (!info.classList.contains('mfjs-info-cols')) {
          info.className = 'mfjs-info-cols'
          parent.querySelector(':scope > .mfjs-info').appendChild(info)
        }

        parent.setAttribute('data-mf-disable-col', '')

        document.onmousemove = e => {
          window.getSelection().removeAllRanges()

          if (breakpoint) {
            if (col) {
              if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
                info.insertAdjacentHTML('beforeend',
                  `<div class="mfjs-info-col${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`)
              }
              info.querySelector('.mfjs-info-col' + breakpoint).innerHTML = 'col' + breakpoint + ':' + col
            } else if (info.querySelector('.mfjs-info-col' + breakpoint)) {
              info.removeChild(info.querySelector('.mfjs-info-col' + breakpoint))
            }
          } else {
            if (col) {
              if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
                info.insertAdjacentHTML('beforeend',
                  `<div class="mfjs-info-col${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`)
              }
              info.querySelector('.mfjs-info-col').innerHTML = 'col:' + col
            } else if (info.querySelector('.mfjs-info-col')) {
              info.removeChild(info.querySelector('.mfjs-info-col'))
            }
          }

          if (Math.ceil((e.clientX - x) / widthCol) !== col) {
            col = Math.ceil((e.clientX - x) / widthCol)
            if (col > 12) {
              col = 0
            } else if (col < 1) {
              col = 'auto'
            }
            parent.className = className.replace(/col-[\d|auto]+/g, '').trim() + (col && ' col-' + col || '')
          }
        }

        document.onmouseup = (e) => {
          parent.className = className.replace(/col-[\d|auto]+/g, '')
          parent.classList.remove('mfjs-active')
          parent.classList.add(col ? 'col-' + col : 'col')
          parent.setAttribute('data-mf-col' + breakpoint, col || '')
          if (col) {
            if (!info.querySelector('.mfjs-info-col' + breakpoint)) {
              info.insertAdjacentHTML('beforeend',
                `<div class="mfjs-info-col${breakpoint} mfjs-show-breakpoint${breakpoint}"></div>`)
            }
            info.querySelector('.mfjs-info-col' + breakpoint).innerHTML = 'col' + breakpoint + ':' + col
          }
          [...parent.attributes].forEach((attr) => {
            if (!col) {
              if (attr.name.substring(0, 11) === 'data-mf-col' && attr.value === '') {
                parent.removeAttribute(attr.name)
              }
            }
            if (attr.name.substring(0, 12) === 'data-mf-col-' &&
              !MfJs.Config.get('settings')?.toolbar?.breakpoints[attr.name.substring(12)]) {
              parent.removeAttribute(attr.name)
            }
          })
          parent.removeAttribute('data-mf-disable-col')
          document.onmousemove = null
          e.preventDefault()
          e.stopPropagation()
        }
      }
    }
  }
}
