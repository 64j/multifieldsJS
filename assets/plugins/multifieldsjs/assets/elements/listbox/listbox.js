/**
 * @version 1.0
 */
MfJs.Elements['listbox'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
        '    [+el.actions+]\n' +
        '    [+el.title+]\n' +
        '    <select id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" size="8">[+el.elements+]</select>\n' +
        '</div>',
    element: '<option value="[+value+]" [+selected+]>[+title+]</option>',
  },

  Render: {
    data: function(data) {
      if (data.elements) {
        let values = data.value.split('||');
        data.el.elements = '';
        data.elements.forEach(function(item, index) {
          data.el.elements += MfJs.Render.template(MfJs.Elements[data.type].templates.element, {
            id: data.id + '_' + index,
            type: data.type,
            name: data.id,
            value: item.key,
            title: item.value !== '' && item.value || item.key,
            selected: ~values.indexOf('' + item.key) ? 'selected' : '',
            checked: ~values.indexOf('' + item.key) ? 'checked' : '',
          });
        });
      }

      return data;
    },
  },
};
