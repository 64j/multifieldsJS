/**
 * @version 1.0
 */
MfJs.Render = {
  initElements: {},

  render: function(data, config, parent, replace) {
    Object.entries(data).map(function([key, item]) {
      if (!MfJs.Elements[item.type]) {
        return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.elementNotFound, {
          type: item.type
        }));
      }
      let items;
      item.name = item.name || key;
      item = MfJs.Render.item(item, config[item.name] || {});
      item = MfJs.Render.elements(item);
      item.actions = MfJs.Actions.set(item);
      if (item.title && typeof item.title !== 'boolean') {
        item.attr += ' data-title="' + item.title + '"';
      }
      item.title = MfJs.Render.title(item.title);
      MfJs.Render.addInit(item.id, item.type);
      if (item.items) {
        items = item.items;
        item.items = '';
      }
      let $config = item['$config'] || {};
      item = MfJs.Render.template(MfJs.Elements[item.type].templates.wrapper, item, true, null);
      if (replace === 1) {
        parent.parentElement.replaceChild(item, parent);
      } else if (replace === 2) {
        if (parent.parentElement.querySelectorAll('[data-name="' + item.dataset.name + '"]').length >= item.dataset.limit) {
          return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
            limit: item.dataset.limit,
          }, null, null));
        }
        parent.insertAdjacentElement('afterend', item);
      } else {
        if (parent.querySelectorAll('[data-name="' + item.dataset.name + '"]').length >= item.dataset.limit) {
          return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
            limit: item.dataset.limit,
          }, null, null));
        }
        parent.appendChild(item);
      }
      if (items) {
        MfJs.Render.render(items, $config, item.querySelector(':scope > .mfjs-items'));
      }
    });
  },

  item: function(data, config) {
    if (config) {
      if (!Object.values(config).length) {
        config = MfJs.Config.find(data.name);
      }
      let c = Object.assign({}, config);
      data['$config'] = Object.assign({}, config.items || {});
      delete c.items;
      data = Object.assign({}, c, data);
    }

    data.id = MfJs.qid('mfjs');

    if (typeof data.value === 'undefined') {
      data.value = '';
    }

    data.class = data.class || '';
    data.attr = data.attr || '';

    if (data.limit) {
      data.attr += ' data-limit="' + data.limit + '"';
    }

    if (MfJs.Elements[data.type]?.Render?.item) {
      data = MfJs.Elements[data.type].Render.item(data, config);
    }

    for (let i in data) {
      let ii = i.replace(/([a-z])([A-Z])/g, '$1-$2').replace('mfjs.', 'mfjs-').toLowerCase();
      if (ii !== i) {
        data.attr += ' data-' + ii + '="' + data[i] + '"';
        delete data[i];
      }
    }

    return data;
  },

  elements: function(item) {
    if (item.elements) {
      let elements = item.elements;
      item.elements = [];
      if (typeof elements === 'string') {
        let key, value;
        elements.split('||').map(function(element) {
          [key, value] = element.split('==', 2);
          if (typeof value === 'undefined') {
            value = key;
          }
          item.elements.push({
            key: key,
            value: value
          });
        });
      } else if (Array.isArray(elements)) {
        for (let i in elements) {
          item.elements.push({
            key: elements[i],
            value: elements[i]
          });
        }
      } else if (elements instanceof Object) {
        for (let key in elements) {
          let value = elements[key];
          key = key[0] === '`' ? key.substr(1) : key;
          item.elements.push({
            key: key,
            value: value
          });
        }
      }
    }

    if (MfJs.Elements[item.type]?.Render?.elements) {
      item = MfJs.Elements[item.type].Render.elements(item);
    }

    return item;
  },

  title: function(title) {
    if (typeof title === 'boolean') {
      title = title ? '' : undefined;
    }
    return typeof title !== 'undefined' ? '<div class="mfjs-title">' + title + '</div>' : '';
  },

  value: function(value) {
    return value;
  },

  addInit: function(id, type) {
    MfJs.Render.initElements[id] = type;
  },

  init: function() {
    Object.entries(MfJs.Render.initElements).map(function([id, type]) {
      if (MfJs.Elements?.[type]?.Render?.init) {
        MfJs.Elements[type].Render.init(id);
      }
      [...document.querySelectorAll('#' + id + ' > .mfjs-items')].map(function(el) {
        Sortable.create(el, {
          animation: 0,
          draggable: '.mfjs-draggable',
          dragClass: 'mfjs-drag',
          ghostClass: 'mfjs-active',
          selectedClass: 'mfjs-selected',
          handle: '.mfjs-actions-move',
          onEnd: function() {
            el = document.getElementById(id).querySelector(':scope > .mfjs-items .mfjs-items > [data-type="id"]');
            if (el && MfJs.Elements?.id?.Render?.init) {
              MfJs.Elements.id.Render.init(el.id);
            }
          },
        });
      });
    });
    MfJs.Render.initElements = {};
  },

  template: function(html, data, isDom, cleanKeys) {
    data = MfJs.Render.flatData(data || {});
    isDom = isDom || false;
    if (typeof cleanKeys === 'undefined') {
      cleanKeys = true;
    }
    html = html.replace(/\[\+([\w\.]*)\+\]/g, function(str, key) {
      let value = typeof data[key] !== 'undefined' ? data[key] : '';
      return (value === null || value === undefined) ? (cleanKeys ? '' : str) : value;
    });
    if (typeof data === 'boolean') {
      isDom = data;
    }
    if (isDom) {
      let fragment = document.createElement('div');
      fragment.innerHTML = html;
      return fragment.children[0];
    } else {
      return html;
    }
  },

  flatData: function(data, key) {
    let out = {};
    key = key && key + '.' || '';
    for (let k in data) {
      if (typeof data[k] === 'object') {
        Object.assign(out, MfJs.Render.flatData(data[k], key + k));
      } else {
        out[key + k] = data[k];
      }
    }
    return out;
  },
};
