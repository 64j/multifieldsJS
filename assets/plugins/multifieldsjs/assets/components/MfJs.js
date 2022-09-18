/**
 * @version 1.0
 * @name MfJs
 */
!function (t) {
  'use strict'
  window.MfJs = t()
}(function () {
  'use strict'

  return new function () {
    document.addEventListener('DOMContentLoaded', function () {
      MfJs.load()
    })

    return {
      Container: null,
      Elements: {},

      render (id, config) {
        MfJs.Container = document.getElementById(id)
        MfJs.Container.addEventListener('mousemove', function () {
          if (MfJs.Container.id !== this.id) {
            MfJs.Container = this
          }
        })
        MfJs.Config.add(config)
        if (config) {
          if (config.templates) {
            MfJs.Container.insertAdjacentHTML('beforeend', MfJs.Templates.render(true))
            MfJs.Container.insertAdjacentHTML('beforeend', MfJs.Actions.render(['template'], {
              id: MfJs.Container.id,
              type: 'mfjs',
            }))
          }

          MfJs.Container.insertAdjacentHTML('beforeend', `<div class="mfjs-items"></div>`)

          if (config.settings) {
            MfJs.Container.insertAdjacentHTML('afterbegin', MfJs.Settings.render(config.settings))
          }

          MfJs.Render.render(MfJs.Container.nextElementSibling.value && JSON.parse(MfJs.Container.nextElementSibling.value) || {}, config.templates || {}, MfJs.Container.querySelector(':scope > .mfjs-items'))
          MfJs.Render.addInit(MfJs.Container.id, 'mfjs')
          MfJs.Render.init()
        } else {
          MfJs.Container.insertAdjacentHTML('beforeend', `Config not found for tv: <strong>${MfJs.Container.id}</strong>`)
        }
        MfJs.Container.isLoaded = true
      },

      load () {
        let form = document['mutate'] || document['settings']
        if (form) {
          form.addEventListener('submit', () => {
            document.querySelectorAll('.mfjs').forEach(el => {
              MfJs.Container = el
              if (!el.disabled) {
                MfJs.save()
              }
            })
            document.querySelectorAll('.mfjs [name]').forEach(el => {
              el.disabled = !0
            })
          })
        }

        document.addEventListener('click', e => {
          let menu = e.target.parentElement && e.target.parentElement.classList.contains('mfjs-actions') && e.target.parentElement.parentElement.querySelector('.mfjs-context-menu') || (e.target.parentElement && typeof e.target.parentElement.dataset['mfjsActions'] !== 'undefined') && e.target.parentElement.querySelector('.mfjs-context-menu') || null
          document.querySelectorAll('.mfjs-context-menu.show').forEach(item => {
            if (menu !== item) {
              item.classList.remove('show')
            }
          })
        })
      },

      save () {
        let data = MfJs.values(MfJs.Container.querySelectorAll(':scope > .mfjs-items > [data-type]'))
        MfJs.Container.nextElementSibling.value = data.length && JSON.stringify(data) || ''
      },

      values (els) {
        let data = [],
          counters = {}
        els.forEach((el, i) => {
          let item = Object.assign({}, el.dataset),
            inputEl

          if (!counters[item.name]) {
            counters[item.name] = 0
          }
          counters[item.name]++

          if (item.type) {
            inputEl = el.querySelector(':scope > .mfjs-value input')
            if (!inputEl) {
              inputEl = el.querySelectorAll('[id][name]')
            }
          } else {
            inputEl = el.querySelector(':scope > input')
          }

          if (inputEl) {
            if (inputEl.length) {
              let value = []
              inputEl.forEach(input => {
                if (!input.hidden) {
                  switch (input.type) {
                    case 'checkbox':
                    case 'radio':
                      if (input.checked) {
                        value.push(input.value)
                      }
                      break

                    case 'select':
                    case 'select-one':
                    case 'select-multiple':
                      for (let i = 0; i < input.length; i++) {
                        if (input[i].selected) {
                          value.push(input[i].value || input[i].text)
                        }
                      }
                      break

                    default:
                      value.push(input.value || '')
                  }
                }
              })
              item.value = value.join('||')
            } else {
              if (!inputEl.hidden) {
                item.value = inputEl.value || ''
              } else if (inputEl.type === 'hidden') {
                item.value = false
              }
            }
          }

          let items = el.querySelectorAll(':scope > .mfjs-items > [data-type]')
          if (items.length) {
            item.items = MfJs.values(items)
            if (MfJs.Elements[item.type]?.values) {
              item = MfJs.Elements[item.type].values(item, el, i)
            }
          }

          for (let i in item) {
            let ii = i.replace(/([a-z])([A-Z])/g, '$1-$2').replace('mf-', 'mf.').toLowerCase()
            if (ii !== i) {
              item[ii] = item[i][0] === '{' ? JSON.parse(item[i]) : item[i]
              delete item[i]
            }
          }

          data.push(item)
        })

        return data
      },

      parents (elem, selector) {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
          Element.prototype.matches =
            Element.prototype['matchesSelector'] ||
            Element.prototype['mozMatchesSelector'] ||
            Element.prototype['msMatchesSelector'] ||
            Element.prototype['oMatchesSelector'] ||
            Element.prototype['webkitMatchesSelector'] ||
            function (s) {
              let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length
              while (--i >= 0 && matches.item(i) !== this) {
              }
              return i > -1
            }
        }

        // Set up a parent array
        let parents = []

        // Push each parent element to the array
        for (; elem && elem !== document; elem = elem.parentNode) {
          if (selector) {
            if (elem.matches(selector)) {
              parents.push(elem)
            }
            continue
          }
          parents.push(elem)
        }

        // Return our parent array
        return parents
      },

      qid: (pf) => (pf || '') + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000),

      escape: (s) => ('' + s).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').trim(),

      alert (message, type) {
        type = type || 'warning'
        if (window.parent['modx']) {
          window.parent['modx'].popup({
            type: type,
            title: 'MultifieldsJS',
            position: 'top center alertMultifieldsJS',
            content: message,
            wrap: 'body'
          })
        } else {
          alert(message)
        }
      },

      popup (settings) {
        let popup = {}
        settings = Object.assign({
          addclass: 'mfjs-popup',
          title: 'MfJS',
          icon: 'fa-layer-group',
          delay: 0,
          overlay: 1,
          overlayclose: 0,
          hide: 0,
          hover: 0,
          width: '80%',
          maxheight: '99%',
          position: 'top center',
          actions: `
<div id="actions">
    <span class="btn btn-sm btn-success mfjs-save">
        <i class="fa fa-floppy-o show no-events"></i>
    </span>
    <span class="btn btn-sm btn-danger mfjs-close">
        <i class="fa fa-times-circle show no-events"></i>
    </span>
</div>`
        }, settings || {})

        if (parent['modx']) {
          let popup = parent['modx'].popup(settings)

          settings.onload && settings.onload(popup, popup.el)

          if (settings.actions) {
            popup.el.querySelector('.evo-popup-close').outerHTML = settings.actions
          }
        } else {
          popup.el = document.createElement('div')
          popup.el.classList = 'evo-popup alert alert-default animation fade in show m-2 ' + (settings.addclass || '')
          popup.el.style.overflow = 'auto'
          popup.el.style.width = settings.width
          popup.el.style.height = 'auto'
          popup.el.style.maxHeight = settings.maxheight
          popup.el.style.top = '0'
          popup.el.style.left = ((100 - parseInt(settings.width)) / 2) + '%'
          popup.el.innerHTML = `
${settings.actions || ''}
<div class="evo-popup-header">
    <i class="fa fa-fw ${settings.icon}"></i>${settings.title}
</div>
<div class="evo-popup-body">${settings.content}</div>`

          popup.overlay = document.createElement('div')
          popup.overlay.classList = 'evo-popup-overlay'
          popup.overlay.style.zIndex = '10500'

          popup.close = function () {
            if (settings.onclose) {
              settings.onclose()
            }
            document.body.style.overflow = ''
            document.body.removeChild(popup.overlay)
            document.body.removeChild(popup.el)
          }

          document.body.append(...[popup.overlay, popup.el])

          settings.onload && settings.onload(popup, popup.el)
        }

        return popup
      }
    }
  }
})
