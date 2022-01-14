/**
 * @version 1.0
 */
MfJs.Elements['checkbox'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
        ' [+el.actions+]\n' +
        ' [+el.title+]\n' +
        ' [+el.elements+]\n' +
        '</div>',
    element: '' +
        '<label class="checkbox">\n' +
        '    <input type="[+type+]" value="[+value+]" id="[+id+]" name="[+name+][]" placeholder="[+placeholder+]" [+checked+] onchange="documentDirty=true;"/>[+title+]</label>\n' +
        '<br/>',
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
