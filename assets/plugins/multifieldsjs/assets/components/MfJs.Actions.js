/**
 * @version 1.0
 */
MfJs.Actions = {
  default: ['move', 'add', 'hide', 'expand', 'del'],
  hidden: [],

  templates: {
    wrapper: `<div class="mfjs-actions" data-actions="{{ id }}">{{ items }}</div>`,
    item: `<i class="mfjs-actions-{{ action }} fa" onclick="MfJs.Actions.action('{{ action }}', this);"></i>`,
  },

  set (data) {
    let actions = MfJs.Elements[data.type]?.Actions?.default || MfJs.Actions.default
    //let hidden = actions.concat(MfJs.Elements[data.type]?.Actions?.hidden || [])
    let hidden = MfJs.Elements[data.type]?.Actions?.hidden || []
    if (typeof data.actions === 'undefined') {
      data.actions = actions.filter(n => {
        return !~hidden.indexOf(n)
      })
    } else if (typeof data.actions === 'boolean') {
      if (data.actions) {
        data.actions = actions
      } else {
        data.actions = actions = data.templates && ['template'] || []
        return MfJs.Actions.render(actions, hidden, data)
      }
    }
    if (~data.actions.indexOf('move')) {
      data.class += ' mfjs-draggable'
    }

    actions = actions.filter(n => {
      return ~data.actions.indexOf(n)
    })

    if (data.templates) {
      actions.push('template')
      data.actions.push('template')
    }

    return MfJs.Actions.render(actions, hidden, data)
  },

  render (actions, hidden, data) {
    return actions.length && MfJs.Render.template(MfJs.Actions.templates.wrapper, {
      id: data.id,
      items: actions.map(action => {
        if (~hidden.indexOf(action) && !~data.actions.indexOf(action)) {
          return
        }
        if (MfJs.Elements[data.type]?.Actions?.item) {
          return MfJs.Elements[data.type].Actions.item(action, data)
        }
        return MfJs.Actions.item(action)
      }).join(''),
    }) || ''
  },

  item (action) {
    return MfJs.Render.template(MfJs.Actions.templates.item, {
      action: action,
    })
  },

  action (action, el) {
    let type = el.parentElement.parentElement.dataset['type'] || null
    if (MfJs.Elements[type]?.Actions?.actions?.[action]) {
      MfJs.Elements[type].Actions.actions[action](el)
    } else if (MfJs.Actions.actions?.[action]) {
      MfJs.Actions.actions[action](el)
    } else {
      MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.noAction, {
        action: action,
      }))
    }
  },

  actions: {
    move (t) {},
    add (t) {
      let el = document.getElementById(t.parentElement.dataset.actions),
        data = MfJs.Config.find(el.dataset.name, MfJs.parents(el, '[data-type]'))
      if (Object.values(data).length && !el?.dataset?.clone) {
        let config = {}
        config[data.name] = Object.assign({}, el.dataset, data)
        MfJs.Render.render([data], config, el, 2)
      } else {
        let d = document.createElement('div')
        d.innerHTML = el.cloneNode(true)['outerHTML'].replace(new RegExp(el.id, 'g'), MfJs.qid('mfjs'))
        let item = d.firstElementChild
        item.querySelectorAll('[id][data-type][data-name]').forEach(el => {
          let id = MfJs.qid('mfjs')
          item.innerHTML = item.innerHTML.replace(new RegExp(el.id, 'g'), id)
          item.querySelectorAll('input').forEach(input => {
            input.value = ''
          })
          item.querySelectorAll('.mfjs-thumb').forEach(input => {
            input.style.backgroundImage = ''
          })
          MfJs.Render.addInit(id, el.dataset.type)
        })

        if (el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length >= el.dataset.limit) {
          return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
            limit: el.dataset.limit,
          }))
        }

        if (item.classList.contains('mfjs-thumb')) {
          item.querySelectorAll('input').forEach(input => {
            input.value = ''
          })
          item.style.backgroundImage = ''
        }

        el.insertAdjacentElement('afterend', item)

        if (item?.dataset?.type && item.id) {
          MfJs.Render.addInit(item.id, item.dataset.type)
        }
      }
      MfJs.Render.init()
    },
    hide (t) {
      let target = t.parentElement.parentElement
      if (target.dataset['mfHide']) {
        target.removeAttribute('data-mf-hide')
      } else {
        target.dataset['mfHide'] = '1'
      }
    },
    expand (t) {
      let target = t.parentElement.parentElement
      if (target.dataset['mfExpand']) {
        target.removeAttribute('data-mf-expand')
      } else {
        target.dataset['mfExpand'] = '1'
      }
    },
    del (t) {
      let el = document.getElementById(t.parentElement.dataset.actions),
        parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates')
      if (el) {
        if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) || el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
          el.parentElement.removeChild(el)
        } else {
          MfJs.Actions.actions.add(t)
          el.parentElement.removeChild(el)
        }
      }
    },
    template (t) {
      let templates = t.parentElement.parentElement.querySelector('.mfjs-templates')
      if (templates.children.length > 1) {
        if (templates.classList.contains('show')) {
          templates.classList.remove('show')
        } else {
          t.position = t.getBoundingClientRect()
          templates.height = 0
          let style = getComputedStyle(templates)
          for (let i = 0; i < templates.children.length; i++) {
            if (templates.height + templates.children[i].offsetHeight > parseInt(style.maxHeight)) {
              break
            }
            templates.height += templates.children[i].offsetHeight
          }
          if (templates.height / 2 > t.position.top - (t.offsetHeight / 2)) {
            templates.style.marginBottom = Math.floor(t.position.top - (t.offsetHeight / 2) - (templates.height / 2)) + 'px'
          } else if (t.position.top + (templates.height / 2) > window.innerHeight) {
            templates.style.marginBottom = Math.ceil(t.position.top + (templates.height / 2) - window.innerHeight) + 'px'
          } else {
            templates.style.marginBottom = ''
          }
          templates.classList.add('show')
        }
      } else {
        templates.firstElementChild.click()
      }
    },
  },
}
