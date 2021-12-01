!function(t) {
  'use strict';
  window.MfJs = t();
}(function() {
  'use strict';

  return new function() {
    document.addEventListener('DOMContentLoaded', function() {
      MfJs.init();
    });

    return {
      config: {},
      options: {},
      elements: {},
      container: null,
      initElements: {},
      actions: ['move', 'add', 'hide', 'expand', 'del'],
      settings: {
        view: ['icons'],
        toolbar: {
          breakpoints: {
            '': {
              name: '',
              value: 0,
              label: 'Default',
              class: 'fa-tv',
            },
            'xl': {
              name: 'xl',
              value: 1200,
              label: 'Desktop (xl) - 1200 px',
              class: 'fa-desktop',
            },
            'lg': {
              name: 'lg',
              value: 992,
              label: 'Laptop (lg) - 992 px',
              class: 'fa-laptop',
            },
            'md': {
              name: 'md',
              value: 768,
              label: 'Tablet (md) - 768 px',
              class: 'fa-tablet-alt',
            },
            'sm': {
              name: 'sm',
              value: 576,
              label: 'Mobile (sm) - 576 px',
              class: 'fa-mobile-alt fa-rotate-270',
            },
            'xs': {
              name: 'xs',
              value: 320,
              label: 'Mobile (xs) - 320 px',
              class: 'fa-mobile-alt',
            },
          },
          export: true,
          import: true,
          fullscreen: true,
          save: true,
        },
      },
      messages: {
        limit: 'The limit ([+limit+]) for adding elements of this name has been exceeded.',
      },

      /**
       *
       * @param type
       * @param obj
       * @returns {*}
       */
      add: function(type, obj) {
        if (!MfJs.elements[type]) {
          MfJs.elements[type] = new function() {
            return Object.assign({
              /**
               *
               * @param t
               */
              actionsAdd: function(t) {
                let el = document.getElementById(t.parentElement.dataset.actions),
                    data = MfJs.getConfig(el.dataset.name, MfJs.parents(el, '[data-type]'));
                if (Object.values(data).length && !el.dataset.clone) {
                  let config = {};
                  config[data.name] = Object.assign({}, el.dataset, data);
                  MfJs.itemRender([data], config, el, 2);
                } else {
                  let d = document.createElement('div');
                  d.innerHTML = el.cloneNode(true).outerHTML.replace(new RegExp(el.id.replace('mfjs', ''), 'g'), MfJs.qid());
                  [d.firstElementChild].map(function(item) {
                    [...item.querySelectorAll('[id][data-type][data-name]')].map(function(el) {
                      let id = MfJs.qid();
                      item.innerHTML = item.innerHTML.replace(new RegExp(el.id.replace('mfjs', ''), 'g'), id);
                      [...item.querySelectorAll('input')].map(function(input) {
                        input.value = '';
                      });
                      [...item.querySelectorAll('.mfjs-thumb')].map(function(input) {
                        input.style.backgroundImage = '';
                      });
                      MfJs.initElements['mfjs' + id] = el.dataset.type;
                    });
                    if (el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length >= el.dataset.limit) {
                      return MfJs.alert(MfJs.template(MfJs.messages.limit, {
                        limit: el.dataset.limit,
                      }));
                    }
                    el.insertAdjacentElement('afterend', item);
                    if (item.dataset && item.dataset.type && item.id) {
                      MfJs.initElements[item.id] = item.dataset.type;
                    }
                  });
                }
                MfJs.initElementsInit();
              },
              /**
               *
               * @param t
               */
              actionsDel: function(t) {
                let el = document.getElementById(t.parentElement.dataset.actions),
                    parent = el && el.parentElement.parentElement.querySelector('.mfjs-templates');
                if ((parent && parent.querySelector('.mfjs-option[data-template-name="' + el.dataset.name + '"]')) || el.parentElement.querySelectorAll('[data-name="' + el.dataset.name + '"]').length > 1) {
                  el && el.parentElement.removeChild(el);
                } else {

                }
              },
              /**
               *
               * @param t
               */
              actionsMove: function(t) {
              },
              /**
               *
               * @param t
               */
              actionsHide: function(t) {
                if (t.parentElement.parentElement.dataset['mfjsHide']) {
                  t.parentElement.parentElement.removeAttribute('data-mfjs-hide');
                } else {
                  t.parentElement.parentElement.dataset['mfjsHide'] = '1';
                }
              },
              /**
               *
               * @param t
               */
              actionsExpand: function(t) {
                if (t.parentElement.parentElement.dataset['mfjsExpand']) {
                  t.parentElement.parentElement.removeAttribute('data-mfjs-expand');
                } else {
                  t.parentElement.parentElement.dataset['mfjsExpand'] = '1';
                }
              },
              template: '',
            }, obj || {});
          };
        }
        return MfJs.elements[type];
      },

      /**
       * Init
       */
      init: function() {
        (document['mutate'] || document['settings']).addEventListener('submit', function() {
          [...document.querySelectorAll('.mfjs')].map(function(el) {
            MfJs.container = el;
            if (!el.disabled) {
              MfJs.save();
            }
          });
          [...document.querySelectorAll('.mfjs [name]')].map(function(el) {
            el.disabled = !0;
          });
        });

        document.addEventListener('click', function(e) {
          let menu = e.target.parentElement && e.target.parentElement.classList.contains('mfjs-actions') && e.target.parentElement.parentElement.querySelector('.mfjs-context-menu') || (e.target.parentElement && typeof e.target.parentElement.dataset['mfjsActions'] !== 'undefined') && e.target.parentElement.querySelector('.mfjs-context-menu') || null;
          [...document.querySelectorAll('.mfjs-context-menu.show')].map(function(item) {
            if (menu !== item) {
              item.classList.remove('show');
            }
          });
        });
      },

      /**
       *
       * @param id
       * @param config
       */
      initElement: function(id, config) {
        MfJs.container = document.getElementById(id);
        MfJs.config[MfJs.container.dataset['mfjs']] = config;
        MfJs.render();
        MfJs.container.addEventListener('mousedown', function() {
          MfJs.container = this;
        });
      },

      /**
       * Render
       */
      render: function() {
        let data = MfJs.getConfig(null);
        if (data) {
          if (data.templates) {
            MfJs.container.insertAdjacentHTML('beforeend', MfJs.getTemplates(true));
            MfJs.container.insertAdjacentHTML('beforeend', '<div class="mfjs-actions"><i onclick="MfJs.actionTemplate(this);" class="mfjs-actions-template fa"></i></div>');
          }

          MfJs.container.insertAdjacentHTML('beforeend', '<div class="mfjs-items"></div>');

          if (data.settings) {
            MfJs.renderSettings(data.settings);
          }

          MfJs.itemRender(MfJs.container.nextElementSibling.value && JSON.parse(MfJs.container.nextElementSibling.value) || {}, data.templates || {}, MfJs.container.querySelector(':scope > .mfjs-items'));
          MfJs.initElements[MfJs.container.id] = 'mfjs';

          MfJs.initElementsInit();
        } else {
          MfJs.container.insertAdjacentHTML('beforeend', 'Config fot tv ' + MfJs.container.dataset['mfjs'] + ' not found.');
        }
      },

      /**
       *
       */
      initElementsInit: function() {
        for (let k in MfJs.initElements) {
          if (MfJs.initElements.hasOwnProperty(k)) {
            if (MfJs.chekMethod(MfJs.initElements[k], 'initElement')) {
              MfJs.method(MfJs.initElements[k], 'initElement', k);
            }
            [...document.querySelectorAll('#' + k + ' > .mfjs-items')].map(function(el) {
              Sortable.create(el, {
                animation: 0,
                draggable: '.mfjs-draggable',
                dragClass: 'mfjs-drag',
                ghostClass: 'mfjs-active',
                selectedClass: 'mfjs-selected',
                handle: '.mfjs-actions-move',
                onEnd: function(e) {
                  if (MfJs.chekMethod('id', 'initElementAfterMove')) {
                    MfJs.method('id', 'initElementAfterMove', k);
                  }
                },
              });
            });
          }
        }
        MfJs.initElements = {};
      },

      /**
       *
       * @param name
       * @param parents
       * @returns {*}
       */
      getConfig: function(name, parents) {
        let templates = MfJs.config[MfJs.container.dataset['mfjs']]['templates'],
            config = {};
        if (parents && parents.length > 1 && !templates[name]) {
          parents = parents.map(function(el) {
            return el.dataset.name;
          });
          config = MfJs.getConfigChildren(templates, parents);
          config.name = name;
        } else {
          if (typeof templates[name] !== 'undefined') {
            MfJs.config[MfJs.container.dataset['mfjs']]['templates'][name]['name'] = name;
            config = templates[name];
          } else if (name === null) {
            config = MfJs.config[MfJs.container.dataset['mfjs']];
          }
        }

        return config;
      },

      /**
       *
       * @param data
       * @param parents
       * @returns {{}}
       */
      getConfigChildren: function(data, parents) {
        let a = {};
        let key = parents.pop();
        for (let k in data) {
          if (data.hasOwnProperty(k) && k === key) {
            if (parents.length) {
              if (data[k]['items']) {
                if (MfJs.chekMethod(data[k]['type'], 'getConfigChildren')) {
                  data[k]['items'] = MfJs.method(data[k]['type'], 'getConfigChildren', data[k]['items']);
                }
                a = MfJs.getConfigChildren(data[k]['items'], parents);
              } else if (data[k]['templates']) {
                a = MfJs.getConfigChildren(Object.keys(data[k]['templates']).reduce(function(obj, key) {
                  obj[data[k]['templates'][key]] = MfJs.config[MfJs.container.dataset['mfjs']]['templates'][data[k]['templates'][key]] || {};
                  return obj;
                }, {}), parents);
              } else {
                a = data[k];
                break;
              }
            } else {
              a = data[k];
              break;
            }
          }
        }

        return a;
      },

      /**
       *
       * @param data
       */
      renderSettings: function(data) {
        let toolbar = '',
            grid = '',
            css = '';

        if (data.view) {
          if (data.view === 'icons') {
            MfJs.container.setAttribute('data-view', 'icons');
          }
        }

        if (data.toolbar) {
          let breakpoints = data.toolbar.breakpoints;

          if (typeof breakpoints === 'boolean') {
            breakpoints = MfJs.settings.toolbar.breakpoints;
          } else if (typeof breakpoints !== 'object') {
            breakpoints = false;
          }

          if (breakpoints) {
            toolbar += '<div class="mfjs-breakpoints">';
            for (let k in breakpoints) {
              if (breakpoints.hasOwnProperty(k)) {
                let breakpoint = breakpoints[k];
                if (typeof breakpoint === 'string') {
                  delete breakpoints[k];
                  breakpoint = MfJs.settings.toolbar.breakpoints[breakpoint];
                  breakpoints[breakpoint.name] = breakpoint;
                }
                let active = '';
                if (localStorage['mfjs-breakpoint-' + MfJs.container.dataset['mfjs']] === breakpoint.name || !localStorage['mfjs-breakpoint-' + MfJs.container.dataset['mfjs']] && !breakpoint.name) {
                  active = ' active';
                  if (breakpoint.name) {
                    MfJs.container.setAttribute('data-mfjs-breakpoint', breakpoint.name);
                    MfJs.container.querySelector(':scope > .mfjs-items').style.maxWidth = breakpoint.value + 'px';
                  }
                }

                let data_breakpoint = breakpoint.name ? '[data-mfjs-breakpoint="' + breakpoint.name + '"]' : ':not([data-mfjs-breakpoint])';
                let data_col = breakpoint.name ? '-' + breakpoint.name : '';

                css += '#mfjs-' + MfJs.container.dataset['mfjs'] + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '="auto"]:not([data-mfjs-disable-col]) { flex: 0 0 auto; max-width: none; width: auto; }';
                css += '#mfjs-' + MfJs.container.dataset['mfjs'] + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '=""]:not([data-mfjs-disable-col]) { flex-basis: 0; flex-grow: 1; }';

                for (let i = 1; i <= 12; i++) {
                  let n = parseFloat((100 / 12 * i).toFixed(4));
                  css += '#mfjs-' + MfJs.container.dataset['mfjs'] + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '="' + i + '"]:not([data-mfjs-disable-col]) { flex: 0 0 ' + n + '%; max-width: ' + n + '%; }';
                  if (i < 12) {
                    css += '#mfjs-' + MfJs.container.dataset['mfjs'] + '.mfjs' + data_breakpoint + ' [data-mfjs-offset' + data_col + '="' + i + '"]:not([data-mfjs-disable-offset]) { margin-left: ' + n + '%; }';
                  }
                }

                if (breakpoint.value) {
                  grid += '<div style="max-width: ' + breakpoint.value + 'px;"></div>';
                }

                toolbar += '' +
                    '<a href="javascript:;" class="mfjs-breakpoint mfjs-btn' + active + '" title="' + breakpoint.label + '" onclick="MfJs.actionsToolbarBreakpoint.call(this, ' + breakpoint.value + ');" data-breakpoint-key="' + breakpoint.value + '" data-breakpoint-name="' + breakpoint.name + '">' +
                    '   ' + (breakpoint.icon || '<i class="fa ' + breakpoint.class + '"></i>') + '\n' +
                    '</a>';
              }
            }
            toolbar += '</div>';
          }

          if (data.toolbar.export) {
            toolbar += '' +
                '<a href="javascript:;" class="mfjs-btn mfjs-btn-toolbar-export" title="Export" onclick="MfJs.actionsToolbarExport.call(this);">\n' +
                '    <i class="fa fa-upload"></i>\n' +
                '</a>';
          }

          if (data.toolbar.import) {
            toolbar += '' +
                '<a href="javascript:;" class="mfjs-btn mfjs-btn-toolbar-import" title="Import" onclick="MfJs.actionsToolbarImport.call(this);">\n' +
                '    <i class="fa fa-download"></i>\n' +
                '</a>';
          }

          if (!data.toolbar.save && MfJs.settings.toolbar.save || data.toolbar.save) {
            toolbar += '' +
                '<a href="javascript:;" class="mfjs-btn mfjs-btn-toolbar-save" title="Save" onclick="MfJs.actionsToolbarSave();">\n' +
                '    <i class="fa fa-floppy-o"></i>\n' +
                '</a>';
          }

          if (data.toolbar.fullscreen) {
            let active = '';
            if (localStorage['mfjs-fullscreen-' + MfJs.container.dataset['mfjs']]) {
              active = ' active';
              document.body.classList.add('mfjs-mode-fullscreen');
              MfJs.container.setAttribute('data-mfjs-fullscreen', '');
            }
            toolbar += '' +
                '<a href="javascript:;" class="mfjs-btn mfjs-btn-toolbar-fullscreen' + active + '" title="Fullscreen" onclick="MfJs.actionsToolbarFullscreen.call(this);">\n' +
                '    <i class="fa fa-expand-arrows-alt"></i>\n' +
                '</a>';
          }

          if (toolbar) {
            MfJs.container.insertAdjacentHTML('afterbegin', '<div class="mfjs-toolbar">' + toolbar + '</div>');
          }

          if (grid) {
            MfJs.container.insertAdjacentHTML('afterbegin', '<div class="mfjs-grid">' + grid + '</div>');
          }

          if (css) {
            document.write('<style>' + css + '</style>');
          }
        }
      },

      /**
       *
       * @param data
       * @returns {string|string}
       */
      getTemplates: function(data) {
        let tpls = '',
            templates = MfJs.config[MfJs.container.dataset['mfjs']]['templates'];
        if (typeof data !== 'undefined') {
          if (typeof data === 'boolean' && data) {
            for (let k in templates) {
              if (templates.hasOwnProperty(k) && !templates[k]['hidden']) {
                tpls += '<div class="mfjs-option" onclick="MfJs.getTemplate(event, \'' + k + '\');" data-template-name="' + k + '">' + (templates[k]['label'] || k) + '</div>';
              }
            }
          } else {
            for (let k in templates) {
              if (templates.hasOwnProperty(k) && ~data.indexOf(k)) {
                tpls += '<div class="mfjs-option" onclick="MfJs.getTemplate(event, \'' + k + '\');" data-template-name="' + k + '">' + (templates[k]['label'] || k) + '</div>';
              }
            }
          }
        }
        return tpls ? '<div class="mfjs-templates mfjs-context-menu contextMenu">' + tpls + '</div>' : '';
      },

      /**
       *
       * @param e
       * @param name
       */
      getTemplate: function(e, name) {
        let parent = e.target.parentElement.parentElement;
        MfJs.itemRender([MfJs.getConfig(name)], {}, parent.querySelector(':scope > .mfjs-items'));
        MfJs.initElementsInit();
        parent.classList.remove('open');
      },

      /**
       *
       * @param data
       * @param config
       * @param parent
       * @param replace
       */
      itemRender: function(data, config, parent, replace) {
        Object.entries(data).map(function([key, item]) {
          let items;
          item.name = item.name || key;
          item.id = MfJs.qid();
          item = MfJs.itemConfig(item, config[item.name] || {});
          item = MfJs.itemElements(item);
          item.actions = MfJs.setActions(item);
          if (item.title && typeof item.title !== 'boolean') {
            item.attr += ' data-title="' + item.title + '"';
          }
          item.title = MfJs.setTitle(item.title);
          MfJs.initElements['mfjs' + item.id] = item.type;
          if (item.items) {
            items = item.items;
            item.items = '';
          }
          let _config = item._config || {};
          item = MfJs.template(MfJs.elements[item.type]['template'], item, true);
          if (replace === 1) {
            parent.parentElement.replaceChild(item, parent);
          } else if (replace === 2) {
            if (parent.parentElement.querySelectorAll('[data-name="' + item.dataset.name + '"]').length >= item.dataset.limit) {
              return MfJs.alert(MfJs.template(MfJs.messages.limit, {
                limit: item.dataset.limit,
              }));
            }
            parent.insertAdjacentElement('afterend', item);
          } else {
            if (parent.querySelectorAll('[data-name="' + item.dataset.name + '"]').length >= item.dataset.limit) {
              return MfJs.alert(MfJs.template(MfJs.messages.limit, {
                limit: item.dataset.limit,
              }));
            }
            parent.appendChild(item);
          }
          if (items) {
            MfJs.itemRender(items, _config, item.querySelector(':scope > .mfjs-items'));
          }
        });
      },

      /**
       *
       * @param data
       * @returns {*}
       */
      itemElements: function(data) {
        data['input'] = '';

        if (MfJs.chekMethod(data.type, 'itemElements')) {
          data = MfJs.method(data.type, 'itemElements', data);
        } else {
          if (data['elements'] && MfJs.elements[data['type']]['input']) {
            switch (data['type']) {
              case 'dropdown':
              case 'listbox':
              case 'listbox-multiple':
              case 'option':
              case 'checkbox':
                let values = data.value.split('||');
                data['elements'].split('||').map(function(item, i) {
                  item = item.split('==');
                  data['input'] += MfJs.template(MfJs.elements[data['type']]['input'], {
                    id: 'mfjs' + data['id'] + '_' + i,
                    type: data['type'],
                    name: 'mfjs' + data['id'],
                    value: item[0],
                    title: typeof item[1] !== 'undefined' ? item[1] : item[0],
                    selected: ~values.indexOf(item[0]) ? 'selected' : '',
                    checked: ~values.indexOf(item[0]) ? 'checked' : '',
                  });
                });
                break;
            }
          }
        }

        return data;
      },

      /**
       *
       * @param data
       * @param config
       * @returns {*}
       */
      itemConfig: function(data, config) {
        if (config) {
          if (!Object.values(config).length) {
            config = MfJs.getConfig(data.name);
          }
          let c = Object.assign({}, config);
          data._config = Object.assign({}, config.items || {});
          delete data._config.items;
          delete c.items;
          data = Object.assign({}, c, data);
        }

        if (typeof data.value === 'undefined') {
          data.value = '';
        }

        data.class = data.class || '';
        data.attr = data.attr || '';

        if (data.limit) {
          data.attr += ' data-limit="' + data.limit + '"';
        }

        if (!data.templates) {
          // let itemsValues = data.items && Object.keys(data.items).reduce(function(obj, key) {
          //   obj[key] = data.items[key];
          //   return obj;
          // }, {}) || Object.create([]);
          // let itemsValues = data.items && Object.values(data.items) || Object.create([]);
          // let configValues = data._config && Object.values(data._config) || Object.create([]);
          // if (itemsValues.length && configValues.length) {
          //   if (itemsValues.length < configValues.length) {
          //     for (let k in data._config) {
          //       k = k.split('#')[0];
          //       if (data._config.hasOwnProperty(k) && data.items[k] && !data.items[k]['items']) {
          //         data.items[k] = data._config[k];
          //       }
          //     }
          //   } else if (itemsValues.length > configValues.length) {
          //     for (let k in data.items) {
          //       k = k.split('#')[0];
          //       if (data.items.hasOwnProperty(k) && data._config[k] && !data.items[k]['items']) {
          //         delete data.items[k];
          //       }
          //     }
          //   }
          // }
          // for (let k in data._config) {
          //   if (data._config.hasOwnProperty(k)) {
          //     let has = Object.values(data.items).filter(function(item) {
          //       if (item.name !== k) {
          //         return false;
          //       }
          //     });
          //     if (has.length) {
          //       data.items[k] = data._config[k];
          //     }
          //   }
          // }
        }

        if (MfJs.chekMethod(data.type, 'itemConfig')) {
          data = MfJs.method(data.type, 'itemConfig', data, config);
        }

        for (let i in data) {
          if (data.hasOwnProperty(i)) {
            let ii = i.replace(/([a-z])([A-Z])/g, '$1-$2').replace('mfjs.', 'mfjs-').toLowerCase();
            if (ii !== i) {
              data.attr += ' data-' + ii + '="' + data[i] + '"';
              delete data[i];
            }
          }
        }

        return data;
      },

      /**
       *
       * @param a
       * @returns {string|string}
       */
      setTitle: function(a) {
        if (typeof a === 'boolean') {
          a = a ? '' : undefined;
        }
        return typeof a !== 'undefined' ? '<div class="mfjs-title">' + a + '</div>' : '';
      },

      /**
       *
       * @returns {string}
       * @param data
       */
      setActions: function(data) {
        let actions = MfJs.elements[data.type]['actions'] || MfJs.actions;
        if (typeof data.actions === 'undefined') {
          data.actions = actions;
        } else if (typeof data.actions === 'boolean') {
          if (data.actions) {
            data.actions = actions;
          } else {
            return '';
          }
        }
        if (~data.actions.indexOf('move')) {
          data.class += ' mfjs-draggable';
        }
        return '<div class="mfjs-actions" data-actions="mfjs' + data.id + '">' + actions.filter(function(n) {
          return ~data.actions.indexOf(n);
        }).map(function(action) {
          if (MfJs.chekMethod(data.type, 'setAction')) {
            return MfJs.method(data.type, 'setAction', action, data);
          }
          return '<i onclick="MfJs.elements[\'' + data.type + '\'].actions' + (action[0].toUpperCase() + action.slice(1)) + '(this);" class="mfjs-actions-' + action + ' fa far"></i>';
        }).join('') + (MfJs.config[MfJs.container.dataset['mfjs']]['templates'][data.name] && MfJs.config[MfJs.container.dataset['mfjs']]['templates'][data.name]['templates'] ? '<i onclick="MfJs.actionTemplate(this);" class="mfjs-actions-template fa"></i>' : '') + '</div>';
      },

      /**
       *
       * @param t
       */
      actionTemplate: function(t) {
        let templates = t.parentElement.parentElement.querySelector('.mfjs-templates');
        if (templates.children.length > 1) {
          templates.classList.toggle('show');
        } else {
          templates.firstElementChild.click();
        }
      },

      save: function() {
        let data = MfJs.saveValues(MfJs.container.querySelectorAll(':scope > .mfjs-items > [data-type]'));
        MfJs.container.nextElementSibling.value = Object.values(data).length && JSON.stringify(data) || '';
      },

      /**
       *
       * @param els
       */
      saveValues: function(els) {
        let data = {},
            counters = {};
        [...els].map(function(el, i) {
          let item = Object.assign({}, el.dataset),
              inputEl;

          if (!counters[item.name]) {
            counters[item.name] = 0;
          }
          counters[item.name]++;

          if (item.type) {
            if (el.querySelector('.mfjs-items')) {
              inputEl = el.querySelector(':scope > .mfjs-value input');
            } else {
              inputEl = el.querySelectorAll('[id][name]');
            }
          } else {
            inputEl = el.querySelector(':scope > input');
          }

          if (inputEl) {
            if (inputEl.length) {
              let value = [];
              [...inputEl].map(function(input) {
                if (!input.hidden) {
                  switch (input.type) {
                    case 'checkbox':
                    case 'radio':
                      if (input.checked) {
                        value.push(input.value);
                      }
                      break;

                    case 'select':
                    case 'select-one':
                    case 'select-multiple':
                      for (let i = 0; i < input.length; i++) {
                        if (input[i].selected) {
                          value.push(input[i].value || input[i].text);
                        }
                      }
                      break;

                    default:
                      value.push(input.value || '');
                  }
                }
              });
              item.value = value.join('||');
            } else {
              if (!inputEl.hidden) {
                item.value = inputEl.value || '';
              } else if (inputEl.type === 'hidden') {
                item.value = false;
              }
            }
          }

          let items = el.querySelectorAll(':scope > .mfjs-items > [data-type]');
          if (items.length) {
            item.items = MfJs.saveValues(items);
            if (MfJs.chekMethod(item.type, 'saveValues')) {
              item = MfJs.method(item.type, 'saveValues', item, el, i);
            }
          }

          for (let i in item) {
            if (item.hasOwnProperty(i)) {
              let ii = i.replace(/([a-z])([A-Z])/g, '$1-$2').replace('mfjs-', 'mfjs.').toLowerCase();
              if (ii !== i) {
                item[ii] = item[i];
                delete item[i];
              }
            }
          }

          if (!data[item.name] && !data[item.name + '#1']) {
            data[item.name] = item;
          } else {
            if (data[item.name]) {
              let _data = {};
              for (let i in data) {
                if (i !== item.name) {
                  _data[i] = data[i];
                } else {
                  _data[item.name + '#1'] = data[item.name];
                }
              }
              data = _data;
            }
            data[item.name + (counters[item.name] && '#' + counters[item.name] || '')] = item;
          }

        });

        return data;
      },

      /**
       *
       * @param data
       * @returns {[]}
       */
      renderValues: function(data) {
        let el = [];
        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            let item = Object.assign({}, data[k], MfJs.config[MfJs.container.dataset['mfjs']]['templates'][data[k].name] || {});
            el.push(MfJs.template(MfJs.elements[item.type]['template'], item), true);
          }
        }

        return el;
      },

      /**
       *
       * @param elem
       * @param selector
       * @returns {null|*}
       * @see https://gomakethings.com/how-to-get-all-parent-elements-with-vanilla-javascript/
       */
      parents: function(elem, selector) {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
          Element.prototype.matches =
              Element.prototype.matchesSelector ||
              Element.prototype.mozMatchesSelector ||
              Element.prototype.msMatchesSelector ||
              Element.prototype.oMatchesSelector ||
              Element.prototype.webkitMatchesSelector ||
              function(s) {
                let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {
                }
                return i > -1;
              };
        }

        // Set up a parent array
        let parents = [];

        // Push each parent element to the array
        for (; elem && elem !== document; elem = elem.parentNode) {
          if (selector) {
            if (elem.matches(selector)) {
              parents.push(elem);
            }
            continue;
          }
          parents.push(elem);
        }

        // Return our parent array
        return parents;
      },

      /**
       *
       * @param pf
       * @returns {string}
       */
      qid: function(pf) {
        return (pf || '') + new Date().getTime() + (Math.floor(Math.random() * 90000) + 10000);
      },

      /**
       *
       * @param s
       * @returns {string}
       */
      escape: function(s) {
        return ('' + s).replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').trim();
      },

      /**
       *
       * @param message
       * @param type
       */
      alert: function(message, type) {
        type = type || 'warning';
        if (window.parent['modx']) {
          window.parent['modx'].popup({
            type: type,
            title: 'MultifieldsJS',
            position: 'top center alertMultifieldsJS',
            content: message,
            wrap: 'body',
          });
        } else {
          alert(message);
        }
      },

      /**
       *
       * @param type
       * @param method
       * @returns {boolean}
       */
      chekMethod: function(type, method) {
        return MfJs.elements[type] && typeof MfJs.elements[type][method] === 'function';
      },

      /**
       *
       * @param type
       * @param method
       * @returns {*}
       */
      method: function(type, method) {
        return MfJs.elements[type][method](...Object.values(arguments).splice(2));
      },

      /**
       *
       * @param breakpoint
       */
      actionsToolbarBreakpoint: function(breakpoint) {
        [...this.parentElement.querySelectorAll('.active')].map(function(item) {
          item.classList.remove('active');
        });
        this.classList.add('active');
        if (parseInt(breakpoint)) {
          MfJs.container.querySelector('.mfjs-items').style.maxWidth = breakpoint + 'px';
          MfJs.container.setAttribute('data-mfjs-breakpoint', this.dataset['breakpointName']);
          MfJs.config[MfJs.container.dataset['mfjs']].breakpoint = this.dataset['breakpointName'];
          localStorage['mfjs-breakpoint-' + MfJs.container.dataset['mfjs']] = this.dataset['breakpointName'];
        } else {
          MfJs.container.querySelector('.mfjs-items').style.maxWidth = '';
          MfJs.container.removeAttribute('data-mfjs-breakpoint');
          MfJs.config[MfJs.container.dataset['mfjs']].breakpoint = null;
          delete localStorage['mfjs-breakpoint-' + MfJs.container.dataset['mfjs']];
        }
      },

      actionsToolbarExport: function() {
        MfJs.save();
        let blob = new Blob([MfJs.container.nextElementSibling.value || '{}']),
            a = document.createElement('a');
        a.href = URL.createObjectURL.call(this, blob, {
          type: 'text/json;charset=utf-8;',
        });
        a.download = MfJs.container.id + '-tv.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
          window.URL.revokeObjectURL(a.href);
          document.body.removeChild(a);
        }, 0);
      },

      actionsToolbarImport: function() {
        let self = this,
            fileInput = document.getElementById('export' + MfJs.container.id) || document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.id = 'export' + MfJs.container.id;
        fileInput.className = 'mfjs-hidden';
        fileInput.onchange = function() {
          let file = this.files[0],
              reader = new FileReader();
          if (file && ~file.name.indexOf('.json')) {
            reader.onload = function() {
              MfJs.container.nextElementSibling.value = reader.result;
              MfJs.container.querySelector('.mfjs-items').innerHTML = '';
              MfJs.container.disabled = true;
              self.style.display = 'none';
              if (self.nextElementSibling && self.nextElementSibling.classList.contains('mfjs-btn-toolbar-save')) {
                self.nextElementSibling.style.display = 'flex';
              }
            };
            reader.readAsText(file);
          }
        };
        MfJs.container.appendChild(fileInput);
        fileInput.click();
      },

      actionsToolbarSave: function() {
        actions.save();
      },

      actionsToolbarFullscreen: function() {
        if (MfJs.container.hasAttribute('data-mfjs-fullscreen')) {
          document.body.classList.remove('mfjs-mode-fullscreen');
          MfJs.container.removeAttribute('data-mfjs-fullscreen');
          this.classList.remove('active');
          delete localStorage['mfjs-fullscreen-' + MfJs.container.dataset['mfjs']];
        } else {
          document.body.classList.add('mfjs-mode-fullscreen');
          MfJs.container.setAttribute('data-mfjs-fullscreen', '');
          this.classList.add('active');
          localStorage['mfjs-fullscreen-' + MfJs.container.dataset['mfjs']] = 1;
        }
      },

      /**
       *
       * @param html
       * @param data
       * @param isDom
       * @param cleanKeys
       * @returns {Element|*}
       */
      template: function(html, data, isDom, cleanKeys) {
        data = data || {};
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
    };
  };
});
