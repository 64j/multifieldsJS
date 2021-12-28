/**
 * @version 1.0
 */
MfJs.Templates = {
  templates: {
    wrapper: '<div class="mfjs-templates mfjs-context-menu contextMenu">[+items+]</div>',
    item: '<div class="mfjs-option" onclick="MfJs.Templates.get(this);" data-template-name="[+name+]">[+label+]</div>',
  },

  get: function(el) {
    let parent = el.parentElement.parentElement;
    MfJs.Render.render([MfJs.Config.find(el.dataset['templateName'])], {}, parent.querySelector(':scope > .mfjs-items'));
    MfJs.Render.init();
    parent.classList.remove('open');
  },

  render: function(data) {
    let tpls = '',
        templates = MfJs.Config.get('templates') || {};

    if (typeof data !== 'undefined') {
      if (typeof data === 'boolean' && data) {
        for (let k in templates) {
          if (!templates[k].hidden) {
            tpls += MfJs.Templates.renderItem(k, templates[k].label || k);
          }
        }
      } else {
        for (let k in templates) {
          if (~data.indexOf(k)) {
            tpls += MfJs.Templates.renderItem(k, templates[k].label || k);
          }
        }
      }
    }

    return tpls ? MfJs.Render.template(MfJs.Templates.templates.wrapper, {
      items: tpls,
    }) : '';
  },

  renderItem: function(name, label) {
    return MfJs.Render.template(MfJs.Templates.templates.item, {
      name: name,
      label: label,
    });
  },
};
