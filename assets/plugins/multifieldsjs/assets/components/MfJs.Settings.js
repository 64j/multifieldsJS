/**
 * @version 1.0
 */
MfJs.Settings = {
  default: {
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
    messages: {
      limit: 'The limit ([+limit+]) for adding elements of this name has been exceeded.',
    },
  },

  templates: {
    grid: '<div class="mfjs-grid">[+items+]</div>',
    gridItem: '<div style="max-width: [+width+]px;"></div>',
    toolbar: '<div class="mfjs-toolbar">[+items+]</div>',
    breakpoints: '<div class="mfjs-breakpoints">[+items+]</div>',
    action: '' +
        '<a href="javascript:;" class="mfjs-btn mfjs-btn-toolbar-[+action+] [+class+]" title="[+title+]" onclick="MfJs.Settings.actions.[+action+](this);" [+attr+]>\n' +
        '    [+icon+]\n' +
        '</a>',
  },

  render: function(settings) {
    let html = '',
        htmlBreakpoints = '',
        htmlToolbar = '',
        htmlGrid = '',
        css = '';

    if (settings.messages) {
      for (let i in settings.messages) {
        MfJs.Settings.default.messages[i] = settings.messages[i];
      }
    }

    if (settings.view) {
      if (settings.view === 'icons') {
        MfJs.Container.setAttribute('data-view', 'icons');
      }
    }

    if (settings.toolbar) {
      let breakpoints = settings.toolbar?.breakpoints || null;

      if (typeof breakpoints === 'boolean') {
        breakpoints = MfJs.Settings.default.toolbar.breakpoints;
      } else if (typeof breakpoints !== 'object') {
        breakpoints = false;
      }

      if (breakpoints) {
        for (let k in breakpoints) {
          let breakpoint = breakpoints[k];
          if (typeof breakpoint === 'string') {
            delete breakpoints[k];
            breakpoint = MfJs.Settings.default.toolbar.breakpoints[breakpoint];
            breakpoints[breakpoint.name] = breakpoint;
          }
          let active = '';
          if (localStorage['mfjs-breakpoint-' + MfJs.Container.id] === breakpoint.name || !localStorage['mfjs-breakpoint-' + MfJs.Container.id] && !breakpoint.name) {
            active = ' active';
            if (breakpoint.name) {
              MfJs.Container.setAttribute('data-mfjs-breakpoint', breakpoint.name);
              MfJs.Container.querySelector(':scope > .mfjs-items').style.maxWidth = breakpoint.value + 'px';
            }
          }

          let data_breakpoint = breakpoint.name ? '[data-mfjs-breakpoint="' + breakpoint.name + '"]' : ':not([data-mfjs-breakpoint])';
          let data_col = breakpoint.name ? '-' + breakpoint.name : '';

          css += '#' + MfJs.Container.id + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '="auto"]:not([data-mfjs-disable-col]) { flex: 0 0 auto; max-width: none; width: auto; }';
          css += '#' + MfJs.Container.id + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '=""]:not([data-mfjs-disable-col]) { flex-basis: 0; flex-grow: 1; max-width: 100%; }';

          for (let i = 1; i <= 12; i++) {
            let n = parseFloat((100 / 12 * i).toFixed(4));
            css += '#' + MfJs.Container.id + '.mfjs' + data_breakpoint + ' [data-mfjs-col' + data_col + '="' + i + '"]:not([data-mfjs-disable-col]) { flex: 0 0 ' + n + '%; max-width: ' + n + '%; }';
            css += '#' + MfJs.Container.id + '.mfjs' + data_breakpoint + ' .mfjs-show-breakpoint' + data_col + ' { display: block; }';
            if (i < 12) {
              css += '#' + MfJs.Container.id + '.mfjs' + data_breakpoint + ' [data-mfjs-offset' + data_col + '="' + i + '"]:not([data-mfjs-disable-offset]) { margin-left: ' + n + '%; }';
            }
          }

          if (breakpoint.value) {
            htmlGrid += MfJs.Render.template(MfJs.Settings.templates.gridItem, {
              width: breakpoint.value,
            });
          }

          htmlBreakpoints += MfJs.Render.template(MfJs.Settings.templates.action, {
            action: 'breakpoint',
            title: breakpoint.label,
            class: active,
            attr: 'data-breakpoint-key="' + breakpoint.value + '" data-breakpoint-name="' + breakpoint.name + '"',
            icon: breakpoint.icon || '<i class="fa ' + breakpoint.class + '"></i>',
          });
        }

        if (htmlBreakpoints) {
          htmlToolbar += MfJs.Render.template(MfJs.Settings.templates.breakpoints, {
            items: htmlBreakpoints,
          });
        }
      }

      if (settings.toolbar.export) {
        htmlToolbar += MfJs.Render.template(MfJs.Settings.templates.action, {
          action: 'export',
          title: 'Export',
          icon: '<i class="fa fa-upload"></i>',
        });
      }

      if (settings.toolbar.import) {
        htmlToolbar += MfJs.Render.template(MfJs.Settings.templates.action, {
          action: 'import',
          title: 'Import',
          icon: '<i class="fa fa-download"></i>',
        });
      }

      if (!settings.toolbar.save && MfJs.Settings.default.toolbar.save || settings.toolbar.save) {
        htmlToolbar += MfJs.Render.template(MfJs.Settings.templates.action, {
          action: 'save',
          title: 'Save',
          icon: '<i class="fa fa-floppy-o"></i>',
        });
      }

      if (settings.toolbar.fullscreen) {
        let active = '';
        if (localStorage['mfjs-fullscreen-' + MfJs.Container.id]) {
          active = 'active';
          document.body.classList.add('mfjs-mode-fullscreen');
          MfJs.Container.setAttribute('data-mfjs-fullscreen', '');
        }

        htmlToolbar += MfJs.Render.template(MfJs.Settings.templates.action, {
          action: 'fullscreen',
          title: 'Fullscreen',
          class: active,
          icon: '<i class="fa fa-expand-arrows-alt"></i>',
        });
      }

      if (htmlToolbar) {
        html += MfJs.Render.template(MfJs.Settings.templates.toolbar, {
          items: htmlToolbar,
        });
      }

      if (htmlGrid) {
        html += MfJs.Render.template(MfJs.Settings.templates.grid, {
          items: htmlGrid,
        });
      }

      if (css) {
        document.write('<style>' + css + '</style>');
      }
    }

    return html;
  },

  actions: {
    breakpoint: function(el) {
      [...el.parentElement.querySelectorAll('.active')].map(function(item) {
        item.classList.remove('active');
      });
      el.classList.add('active');
      if (parseInt(el.dataset['breakpointKey'])) {
        MfJs.Container.querySelector('.mfjs-items').style.maxWidth = el.dataset['breakpointKey'] + 'px';
        MfJs.Container.setAttribute('data-mfjs-breakpoint', el.dataset['breakpointName']);
        MfJs.Config.get().breakpoint = el.dataset['breakpointName'];
        localStorage['mfjs-breakpoint-' + MfJs.Container.id] = el.dataset['breakpointName'];
      } else {
        MfJs.Container.querySelector('.mfjs-items').style.maxWidth = '';
        MfJs.Container.removeAttribute('data-mfjs-breakpoint');
        MfJs.Config.get().breakpoint = null;
        delete localStorage['mfjs-breakpoint-' + MfJs.Container.id];
      }
    },
    export: function(el) {
      MfJs.save();
      let blob = new Blob([MfJs.Container.nextElementSibling.value || '{}']),
          a = document.createElement('a');
      a.href = URL.createObjectURL.call(el, blob, {
        type: 'text/json;charset=utf-8;',
      });
      a.download = MfJs.Container.id + '-tv.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }, 0);
    },
    import: function(el) {
      let fileInput = document.getElementById('export' + MfJs.Container.id) || document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.id = 'export' + MfJs.Container.id;
      fileInput.className = 'mfjs-hidden';
      fileInput.onchange = function() {
        let file = this.files[0],
            reader = new FileReader();
        if (file && ~file.name.indexOf('.json')) {
          reader.onload = function() {
            MfJs.Container.nextElementSibling.value = reader.result;
            MfJs.Container.querySelector('.mfjs-items').innerHTML = '';
            MfJs.Container.disabled = true;
            el.style.display = 'none';
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('mfjs-btn-toolbar-save')) {
              el.nextElementSibling.style.display = 'flex';
            }
          };
          reader.readAsText(file);
        }
      };
      MfJs.Container.appendChild(fileInput);
      fileInput.click();
    },
    fullscreen: function(el) {
      if (MfJs.Container.hasAttribute('data-mfjs-fullscreen')) {
        document.body.classList.remove('mfjs-mode-fullscreen');
        MfJs.Container.removeAttribute('data-mfjs-fullscreen');
        el.classList.remove('active');
        delete localStorage['mfjs-fullscreen-' + MfJs.Container.id];
      } else {
        document.body.classList.add('mfjs-mode-fullscreen');
        MfJs.Container.setAttribute('data-mfjs-fullscreen', '');
        el.classList.add('active');
        localStorage['mfjs-fullscreen-' + MfJs.Container.id] = 1;
      }
    },
    save: function() {
      actions.save();
    },
  },
};
