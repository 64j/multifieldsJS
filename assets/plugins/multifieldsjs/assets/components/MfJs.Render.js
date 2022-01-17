/**
 * @version 1.0
 */
MfJs.Render = {
  initElements: {},

  render: function(data, config, parent, replace) {
    if (!parent) {
      return;
    }
    Object.entries(data).forEach(function([key, data]) {
      if (!MfJs.Elements[data.type]) {
        return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.elementNotFound, {
          type: data.type,
        }));
      }
      data.name = data.name || key;
      data = MfJs.Render.data(data, config[data.name] || {});
      MfJs.Render.addInit(data.id, data.type);
      let items = '';
      if (data.items) {
        items = data.items;
        data.items = '';
      }
      let item = MfJs.Render.template(MfJs.Elements[data.type].templates.wrapper, data, true);
      if (replace === 1) {
        parent.parentElement.replaceChild(item, parent);
      } else if (replace === 2) {
        if (parent.parentElement.querySelectorAll('[data-name="' + data.name + '"]').length >= data.limit) {
          return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
            limit: data.limit,
          }));
        }
        parent.insertAdjacentElement('afterend', item);
      } else {
        if (parent.querySelectorAll('[data-name="' + data.name + '"]').length >= data.limit) {
          return MfJs.alert(MfJs.Render.template(MfJs.Settings.default.messages.limit, {
            limit: data.limit,
          }));
        }
        parent.appendChild(item);
      }
      if (items) {
        MfJs.Render.render(items, data['$config'] || {}, item.querySelector(':scope > .mfjs-items'));
      }
    });
  },

  data: function(data, config) {
    if (config) {
      if (!Object.values(config).length) {
        config = MfJs.Config.find(data.name);
      }
      let c = {...config};
      delete c.items;
      data['$config'] = config.items || {};
      data = {...c, ...data};
    }

    data.id = MfJs.qid('mfjs');
    data.class = data.class || '';
    data.attr = data.attr || '';
    data.value = typeof data.value === 'undefined' ? '' : data.value;
    data.el = {};

    data.prepare && delete data.prepare;
    data.prepareWrap && delete data.prepareWrap;

    if (data.elements) {
      let elements = data.elements;
      data.elements = [];
      if (typeof elements === 'string') {
        let key, value;
        elements.split('||').forEach(function(element) {
          [key, value] = element.split('==', 2);
          if (typeof value === 'undefined') {
            value = key;
          }
          data.elements.push({
            key: key,
            value: value,
          });
        });
      } else if (Array.isArray(elements)) {
        for (let value of elements) {
          data.elements.push({
            key: value,
            value: value,
          });
        }
      } else if (elements instanceof Object) {
        for (let key in elements) {
          let value = elements[key];
          key = key[0] === '`' ? key.substr(1) : key;
          data.elements.push({
            key: key,
            value: value,
          });
        }
      }
    }

    if (MfJs.Elements[data.type]?.Render?.data) {
      data = MfJs.Elements[data.type].Render.data(data, config);
    }

    data.el.title = MfJs.Render.title(data.title);
    data.el.actions = MfJs.Actions.set(data);

    if (!data.el.actions) {
      data.attr += ' data-no-actions';
    }

    ['name', 'type', 'title', 'clone', 'limit'].forEach(function(item) {
      if (typeof data[item] !== 'undefined') {
        data.attr += ' data-' + item + '="' + MfJs.escape(data[item]) + '"';
      }
    });

    if (typeof config.title === 'string') {
      data.attr += ' data-title-original="' + config.title + '"';
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

  title: function(title) {
    if (typeof title === 'boolean') {
      title = title ? '' : undefined;
    }
    return typeof title !== 'undefined' ? '<div class="mfjs-title">' + title + '</div>' : '';
  },

  addInit: function(id, type) {
    MfJs.Render.initElements[id] = type;
  },

  init: function() {
    Object.entries(MfJs.Render.initElements).forEach(function([id, type]) {
      if (MfJs.Elements?.[type]?.Render?.init) {
        MfJs.Elements[type].Render.init(id);
      }
      document.querySelectorAll('#' + id + ' > .mfjs-items').forEach(function(el) {
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
    isDom = isDom || null;
    cleanKeys = !(cleanKeys || null);
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
