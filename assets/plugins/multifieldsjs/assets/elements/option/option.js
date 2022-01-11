/**
 * @version 1.0
 */
MfJs.Elements['option'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
        ' [+actions+]\n' +
        ' [+title+]\n' +
        ' [+elements+]\n' +
        '</div>',

    element: '<input type="radio" value="[+value+]" id="[+id+]" name="[+name+]" placeholder="[+placeholder+]" [+checked+] onchange="documentDirty=true;" /><label for="[+id+]" class="radio">[+title+]</label>',
  },

  Render: {
    elements: function(item) {
      if (item.elements) {
        let values = item.value.split('||');
        item.elements = item.elements.map(function(element, index) {
          return MfJs.Render.template(MfJs.Elements[item.type].templates.element, {
            id: item.id + '_' + index,
            type: item.type,
            name: item.id,
            value: element.key,
            title: element.value !== '' && element.value || element.key,
            selected: ~values.indexOf('' + element.key) ? 'selected' : '',
            checked: ~values.indexOf('' + element.key) ? 'checked' : '',
          }, null, null);
        }).join('');
      }

      return item;
    },
  },
};
