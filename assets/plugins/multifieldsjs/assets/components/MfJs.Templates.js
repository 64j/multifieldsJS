/**
 * @version 1.0
 */
MfJs.Templates = {
  get: function(el, name) {
    let parent = el.parentElement.parentElement;
    MfJs.Render.render([MfJs.Config.find(name)], {}, parent.querySelector(':scope > .mfjs-items'));
    MfJs.Render.init();
    parent.classList.remove('open');
  },

  render: function(data) {
    let tpls = '',
        templates = MfJs.Config.get('templates') || {};

    if (typeof data !== 'undefined') {
      if (typeof data === 'boolean' && data) {
        for (let k in templates) {
          if (templates.hasOwnProperty(k) && !templates[k].hidden) {
            tpls += MfJs.Templates.renderItem(k, templates[k].label || k);
          }
        }
      } else {
        for (let k in templates) {
          if (templates.hasOwnProperty(k) && ~data.indexOf(k)) {
            tpls += MfJs.Templates.renderItem(k, templates[k].label || k);
          }
        }
      }
    }

    return tpls ? '<div class="mfjs-templates mfjs-context-menu contextMenu">' + tpls + '</div>' : '';
  },

  renderItem: function(key, name) {
    return '<div class="mfjs-option" onclick="MfJs.Templates.get(this, \'' + key + '\');" data-template-name="' + key + '">' + name + '</div>';
  },
};
