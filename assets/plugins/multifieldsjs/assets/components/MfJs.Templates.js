/**
 * @version 1.0
 */
MfJs.Templates = {
  templates: {
    wrapper: '<div class="mfjs-templates mfjs-context-menu contextMenu">[+items+]</div>',
    item: '<div class="mfjs-option" onclick="MfJs.Templates.get(\'[+name+]\', this);" data-template-name="[+name+]">[+label+]</div>',
  },

  get: function(name, el) {
    let parent = el.parentElement.parentElement;
    MfJs.Render.render([MfJs.Config.find(name)], {}, parent.querySelector(':scope > .mfjs-items'));
    MfJs.Render.init();
    parent.classList.remove('open');
  },

  render: function(data) {
    let templates = [];

    if (typeof data !== 'undefined') {
      templates = Object.entries(MfJs.Config.get('templates') || {}).filter(function([k, item]) {
        return typeof data === 'boolean' && data ? !item.hidden : ~data.indexOf(k);
      });
    }

    return templates.length && MfJs.Render.template(MfJs.Templates.templates.wrapper, {
      items: templates.map(function([k, item]) {
        return MfJs.Templates.renderItem(k, item.label || k);
      }).join(''),
    }) || '';
  },

  renderItem: function(name, label) {
    return MfJs.Render.template(MfJs.Templates.templates.item, {
      name: name,
      label: label,
    });
  },
};
