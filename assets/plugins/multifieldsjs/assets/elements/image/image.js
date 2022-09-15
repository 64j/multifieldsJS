/**
 * @version 1.0
 */
MfJs.Elements['image'] = {
  templates: {
    wrapper: '' +
      '<div id="{{ id }}" class="col {{ class }}" {{ attr }}>\n' +
      '    {{ el.actions }}\n' +
      '    {{ el.title }}\n' +
      '    <input type="text" id="tv{{ id }}" class="form-control {{ item.class }}" name="{{ name }}" placeholder="{{ placeholder }}" value="{{ value }}" onchange="documentDirty=true;MfJs.Elements.image.Actions.actions.edit(this);" {{ item.attr }}>\n' +
      '    <i class="{{ icon }}" onclick="BrowseServer(\'tv{{ id }}\');{{ onclick }}"></i>\n' +
      '</div>',
  },

  interval: null,

  Render: {
    data (data, config) {
      let multi = typeof config['multi'] === 'boolean' && config['multi'] && data.name || config['multi'] || ''
      let thumb = config['thumb'] || ''

      if (multi) {
        data.attr += ' data-multi="' + multi + '"'
        data.icon = 'far fa-images'
        data.onclick = 'MfJs.Elements.image.MultiBrowseServer(this);'
      } else {
        data.icon = 'far fa-image'
      }

      if (thumb) {
        data.attr += ' data-thumb="' + thumb + '"'
      }

      return data
    },
  },

  Actions: {
    actions: {
      edit (t) {
        if (t.parentElement.dataset['thumb']) {
          let thumbs = t.parentElement.dataset['thumb'].split(','),
            itemsEl = t.parentElement.parentElement
          for (let k in thumbs) {
            if (thumbs.hasOwnProperty(k)) {
              itemsEl.querySelectorAll('[data-name="' + thumbs[k] + '"]').forEach(item => {
                item.style.backgroundImage = 'url(\'../' + t.value + '\')'
                let input = item.querySelector(':scope > .mfjs-value input')
                if (input) {
                  input.value = t.value
                }
              })
            }
          }
        }
      },
    },
  },

  MultiBrowseServer (t) {
    MfJs.Elements.image.interval = setInterval(() => {
      if (window.KCFinder) {
        clearInterval(MfJs.Elements.image.interval)
        window.KCFinder.callBackMultiple = (files) => {
          let el = document.getElementById(t.previousElementSibling.id)
          window.KCFinder = null
          window.lastFileCtrl = t.id
          window.SetUrl(files[0])

          if (MfJs.Elements.thumb.popup) {
            let parent = el.parentElement
            if (parent.dataset['multi'] === parent.dataset['name']) {
              let parents = MfJs.parents(parent, '[data-type]')
              parents.push(MfJs.Elements.thumb.parent)
              for (let k in files) {
                if (files.hasOwnProperty(k) && parseInt(k)) {
                  MfJs.Render.render([MfJs.Config.find(parent.dataset.name, parents)], {}, parent, 2)
                  parent = parent.nextElementSibling
                  parent.querySelector(':scope > input').value = files[k]
                  window.lastFileCtrl = parent.id
                  window.SetUrl(files[k])
                }
              }
            } else if (parent.dataset['multi'] === MfJs.Elements.thumb.parent.dataset['name']) {
              parent = MfJs.Elements.thumb.parent
              for (let k in files) {
                if (files.hasOwnProperty(k) && parseInt(k)) {
                  MfJs.Render.render([MfJs.Config.find(parent.dataset['name'])], {}, parent, 2)
                  parent = parent.nextElementSibling
                  let input = parent.querySelector('[data-name="' + el.parentElement.dataset['name'] + '"] > input')
                  if (input) {
                    input.value = files[k]
                    let thumbs = t.parentElement.dataset['thumb'].split(',')
                    for (let j in thumbs) {
                      if (thumbs.hasOwnProperty(j)) {
                        let elem = parent.dataset.name === thumbs[j] ? parent : parent.querySelector('[data-name="' + thumbs[j] + '"]')
                        if (elem) {
                          elem.style.backgroundImage = 'url(\'../' + files[k] + '\')'
                          let input = elem.querySelector(':scope > .mfjs-value input')
                          if (input) {
                            input.value = files[k]
                          }
                        }
                      }
                    }
                    window.lastFileCtrl = input.parentElement.id
                    window.SetUrl(files[k])
                  }
                }
              }
            }
            MfJs.Elements.thumb.popup.el.querySelector('.mfjs-save').click()
          } else {
            let parent = el.parentElement
            for (let k in files) {
              if (files.hasOwnProperty(k) && parseInt(k)) {
                MfJs.Render.render([MfJs.Config.find(parent.dataset.name)], {}, parent, 2)
                parent = parent.nextElementSibling
                parent.querySelector(':scope > input').value = files[k]
                window.lastFileCtrl = parent.id
                window.SetUrl(files[k])
              }
            }
          }
        }
      }
    }, 100)
  },
}
