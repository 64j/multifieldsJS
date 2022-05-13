/**
 * @version 1.0
 */
MfJs.Elements['thumb'] = {
  popup: null,
  parent: null,
  interval: null,

  templates: {
    wrapper: '' +
      '<div id="[+id+]" class="mfjs-thumb col [+class+]" [+attr+]>\n' +
      '    [+el.title+]\n' +
      '    [+el.actions+]\n' +
      '    [+el.value+]\n' +
      '    <div class="mfjs-value" hidden>\n' +
      '        <input type="text" id="[+id+]_value" class="form-control form-control-sm" value="[+value+]">\n' +
      '    </div>' +
      '    <div class="mfjs-items [+items.class+]"></div>\n' +
      '</div>',
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
        let el = t.parentElement.parentElement
        if (el.classList.contains('mfjs-group')) {
          if (parent['modx']) {
            Thumb.popup = parent['modx'].popup({
              addclass: 'mfjs-popup',
              title: el.querySelector('.mfjs-title') && el.querySelector('.mfjs-title').innerHTML || el.dataset.type,
              content: '<div class="mfjs"><div class="mfjs-items"></div></div>',
              icon: 'fa-layer-group',
              delay: 0,
              overlay: 1,
              overlayclose: 0,
              hide: 0,
              hover: 0,
              width: '80%',
              maxheight: '99%',
              position: 'top center',
              onclose (e, el) {
                el.classList.remove('show')
                Thumb.popup = null
              },
            })

            Thumb.clone = el.querySelector(':scope > .mfjs-items').cloneNode(true).children

            Thumb.popup.el.querySelector('.mfjs .mfjs-items').append(...el.querySelector(':scope > .mfjs-items').children)

            Thumb.popup.el.querySelector('.evo-popup-close').outerHTML = '<div id="actions" class="position-absolute"><span class="btn btn-sm btn-success mfjs-save"><i class="fa fa-floppy-o show no-events"></i></span><span class="btn btn-sm btn-danger mfjs-close"><i class="fa fa-times-circle show no-events"></i></span></div>'

            Thumb.parent = el

            Thumb.popup.el.addEventListener('click', function (e) {
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
                this.close()
              }
              if (e.target.classList.contains('mfjs-close')) {
                Thumb.parent.querySelector('.mfjs-items').append(...Thumb.clone)
                this.close()
              }
            })
          } else {
            alert('Not found function parent.modx !')
          }
        } else {
          let valueEl = el.querySelector(':scope > .mfjs-value input')
          if (valueEl) {
            BrowseServer(valueEl.id)
            if (el.dataset['multi']) {
              MfJs.Elements.thumb.MultiBrowseServer(valueEl)
            }
            if (el.dataset['image']) {
              valueEl.onchange = (e) => {
                el.style.backgroundImage = 'url(\'../' + e.target.value + '\')';
                [...el.parentElement.querySelectorAll('[data-name="' + el.dataset['image'] + '"]')].map(el => {
                  el.querySelector('[name]').value = e.target.value
                })
              }
            } else {
              valueEl.onchange = (e) => {
                el.style.backgroundImage = 'url(\'../' + e.target.value + '\')'
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
