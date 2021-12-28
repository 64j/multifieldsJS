/**
 * @version 1.0
 */
MfJs.Actions = {
  default: ['move', 'add', 'hide', 'expand', 'del'],

  templates: {
    wrapper: '<div class="mfjs-actions" data-actions="[+id+]">[+items+]</div>',
    item: '<i class="mfjs-actions-[+action+] fa" onclick="MfJs.Actions.action(\'[+action+]\', this);"></i>'
  },

  set: function(data) {
    let actions = MfJs.Elements[data.type]?.Actions?.default || MfJs.Actions.default;
    if (typeof data.actions === 'undefined') {
      data.actions = actions;
    } else if (typeof data.actions === 'boolean') {
      if (data.actions) {
        data.actions = actions;
      } else {
        return data['templates'] ? MfJs.Actions.render(['template'], data) : '';
      }
    }
    if (~data.actions.indexOf('move')) {
      data.class += ' mfjs-draggable';
    }

    actions = actions.filter(function(n) {
      return ~data.actions.indexOf(n);
    });

    if (MfJs.Config.get('templates')?.[data.name]?.templates) {
      actions.push('template');
    }

    return MfJs.Actions.render(actions, data);
  },

  render: function(actions, data) {
    return MfJs.Render.template(MfJs.Actions.templates.wrapper, {
      id: data.id,
      items: actions.map(function(action) {
        if (MfJs.Elements[data.type]?.Actions?.item) {
          return MfJs.Elements[data.type].Actions.item(action, data);
        }
        return MfJs.Actions.item(action);
      }).join('')
    });
  },

  item: function(action) {
    return MfJs.Render.template(MfJs.Actions.templates.item, {
      action: action,
    });
  },

  action: function(action, el) {
    let type = el.parentElement.parentElement.dataset['type'] || null;
    if (MfJs.Elements[type]?.Actions?.actions?.[action]) {
      MfJs.Elements[type].Actions.actions[action](el);
    } else if (MfJs.Actions.actions?.[action]) {
      MfJs.Actions.actions[action](el);
    }
  },

  actions: {
    move: function(t) {},
    add: function(t) {
      let el = document.getElementById(t.parentElement.dataset.actions),
          data = MfJs.Config.find(el.dataset.name, MfJs.parents(el, '[data-type]'));
      if (Object.values(data).length && !el.dataset.clone) {
        let config = {};
        config[data.name] = Object.assign({}, el.dataset, data);
        MfJs.Render.render([data], config, el, 2);
      } else {
        let d = document.createElement('div');
        d.innerHTML = el.cloneNode(true).outerHTML.replace(new RegExp(el.id, 'g'), MfJs.qid('mfjs'));
        [d.firstElementChild].map(function(item) {
          [...item.querySelectorAll('[id][data-type][data-name]')].map(function(el) {
            let id = MfJs.qid('mfjs');
            item.innerHTML = item.innerHTML.replace(new RegExp(el.id, 'g'), id);
            [...item.querySelectorAll('input')].map(function(input) {
              input.value = '';
            });
            [...item.querySelectorAll('.mfjs-thumb')].map(function(input) {
              input.style.backgroundImage = '';
            });
            MfJs.Render.addInit(id, el.dataset.type);
          });
          if (el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length >= el.dataset.limit) {
            return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
              limit: el.dataset.limit,
            }, null, null));
          }
          el.insertAdjacentElement('afterend', item);
          if (item.dataset && item.dataset.type && item.id) {
            MfJs.Render.addInit(item.id, item.dataset.type);
          }
        });
      }
      MfJs.Render.init();
    },
    hide: function(t) {
      let target = t.parentElement.parentElement;
      if (target.dataset['mfjsHide']) {
        target.removeAttribute('data-mfjs-hide');
      } else {
        target.dataset['mfjsHide'] = '1';
      }
    },
    expand: function(t) {
      let target = t.parentElement.parentElement;
      if (target.dataset['mfjsExpand']) {
        target.removeAttribute('data-mfjs-expand');
      } else {
        target.dataset['mfjsExpand'] = '1';
      }
    },
    del: function(t) {
      let el = document.getElementById(t.parentElement.dataset.actions),
          parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates');
      if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) || el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
        el && el.parentElement.removeChild(el);
      } else {

      }
    },
    template: function(t) {
      let templates = t.parentElement.parentElement.querySelector('.mfjs-templates');
      if (templates.children.length > 1) {
        templates.classList.toggle('show');
      } else {
        templates.firstElementChild.click();
      }
    },
  },
};
