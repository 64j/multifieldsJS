/**
 * @version 1.0
 */
MfJs.Elements['option'] = {
  templates: {
    wrapper: '' +
      '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
      ' [+el.actions+]\n' +
      ' [+el.title+]\n' +
      ' [+el.elements+]\n' +
      '</div>',

    element: '<input type="radio" value="[+value+]" id="[+id+]" name="[+name+]" placeholder="[+placeholder+]" [+checked+] onchange="documentDirty=true;" /><label for="[+id+]" class="radio">[+title+]</label>',
  },

  Render: {
    data (data) {
      if (data.elements) {
        let values = data.value.split('||')
        data.el.elements = ''
        data.elements.forEach((item, index) => {
          data.el.elements += MfJs.Render.template(MfJs.Elements[data.type].templates.element, {
            id: data.id + '_' + index,
            type: data.type,
            name: data.id,
            value: item.value,
            title: item.key !== '' && item.key || item.value,
            selected: ~values.indexOf('' + item.value) ? 'selected' : '',
            checked: ~values.indexOf('' + item.value) ? 'checked' : '',
          })
        })
      }

      return data
    },
  },
}
