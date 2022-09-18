/**
 * @version 1.0
 */
MfJs.Elements['thumb'] = {
  popup: null,
  parent: null,
  interval: null,

  templates: {
    wrapper: `
<div id="{{ id }}" class="mfjs-thumb col {{ class }}" {{ attr }}>
    {{ el.title }}
    {{ el.actions }}
    {{ el.value }}
    <div class="mfjs-value" hidden>
        <input type="text" id="{{ id }}_value" class="form-control form-control-sm" value="{{ value }}">
    </div>
    <div class="mfjs-items {{ items.class }}"></div>
</div>`,
  },

  Render: {
    data (data, config) {
      let multi = typeof config['multi'] === 'boolean' && config['multi'] && data.name || config['multi'] || ''

      if (config.items) {
        data.class = 'mfjs-group'
      } else {
        if (multi) {
          data.attr += ' data-multi="' + multi + '"'
        }
      }

      data.attr += 'style="background-image: url(../' + data.value + ');"'

      return data
    },
  },

  Actions: {
    default: ['move', 'add', 'hide', 'expand', 'edit', 'del'],
    actions: {
      edit (t) {
        let Thumb = this
        Thumb.parent = t.parentElement.parentElement

        if (Thumb.parent.classList.contains('mfjs-group')) {
          Thumb.clone = Thumb.parent.querySelector(':scope > .mfjs-items').cloneNode(true)
          MfJs.popup(Object.assign({
            title: Thumb.parent.querySelector('.mfjs-title') && Thumb.parent.querySelector('.mfjs-title').innerHTML ||
              Thumb.parent.dataset.type,
            content: `<div class="mfjs"><div class="mfjs-items"></div></div>`,
            onload (popup, el) {
              el.querySelector('.mfjs .mfjs-items').
                append(...Thumb.parent.querySelector(':scope > .mfjs-items').children)

              el.addEventListener('click', function (e) {
                if (e.target.classList.contains('mfjs-save')) {
                  this.classList.remove('show')
                  documentDirty = true
                  this.querySelectorAll('.mfjs-items [data-thumb]').forEach(el => {
                    let value = el.querySelector('input').value
                    if (el.dataset['thumb'] === Thumb.parent.dataset['name']) {
                      Thumb.parent.querySelector(':scope > .mfjs-value input').value = value
                      Thumb.parent.style.backgroundImage = 'url(\'../' + value + '\')'
                    } else {
                      let thumbs = el.dataset['thumb'].toString().split(',')
                      for (let k in thumbs) {
                        if (thumbs.hasOwnProperty(k) && Thumb.parent.dataset['name'] === thumbs[k]) {
                          Thumb.parent.style.backgroundImage = 'url(\'../' + value + '\')'
                          let input = Thumb.parent.querySelector(':scope > .mfjs-value input')
                          if (input) {
                            input.value = value
                          }
                          break
                        }
                      }
                    }
                  })
                  Thumb.parent.querySelector('.mfjs-items').append(...this.querySelector('.mfjs-items').children)
                  popup.close()
                }
                if (e.target.classList.contains('mfjs-close')) {
                  popup.close()
                }
              })
            },
            onclose () {
              let items = Thumb.parent.querySelector('.mfjs-items')
              if (!items.childElementCount) {
                items.append(...Thumb.clone.children)
              }
            }
          }, Thumb.parent.dataset.mfPopup ? JSON.parse(Thumb.parent.dataset.mfPopup) : {}))
        } else {
          let valueEl = Thumb.parent.querySelector(':scope > .mfjs-value input')
          if (valueEl) {
            BrowseServer(valueEl.id)
            if (Thumb.parent.dataset['multi']) {
              MfJs.Elements.thumb.MultiBrowseServer(valueEl)
            }
            if (Thumb.parent.dataset['image']) {
              valueEl.onchange = (e) => {
                Thumb.parent.style.backgroundImage = 'url(\'../' + e.target.value + '\')';
                [...Thumb.parent.parentElement.querySelectorAll('[data-name="' + el.dataset['image'] + '"]')].map(
                  el => {
                    el.querySelector('[name]').value = e.target.value
                  })
              }
            } else {
              valueEl.onchange = (e) => {
                Thumb.parent.style.backgroundImage = 'url(\'../' + e.target.value + '\')'
              }
            }
          }
        }
      },
    },
  },

  MultiBrowseServer (el) {
    MfJs.Elements.thumb.interval = setInterval(() => {
      if (window.KCFinder) {
        clearInterval(MfJs.Elements.thumb.interval)
        window.KCFinder.callBackMultiple = (files) => {
          window.KCFinder = null
          window.lastFileCtrl = el.id
          window.SetUrl(files[0].replace('/.thumbs/', '/'))
          for (let k in files) {
            if (files.hasOwnProperty(k) && parseInt(k)) {
              files[k] = files[k].replace('/.thumbs/', '/')
              let parent = el.parentElement.parentElement
              MfJs.Render.render([MfJs.Config.find(parent.dataset.name)], {}, parent, 2)
              parent.nextElementSibling.style.backgroundImage = 'url(\'../' + files[k] + '\')'
              window.lastFileCtrl = parent.nextElementSibling.querySelector('.mfjs-value > input').id
              window.SetUrl(files[k])
            }
          }
        }
      }
    }, 100)
  },
}
