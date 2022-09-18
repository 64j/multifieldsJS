/**
 * @version 1.0
 */
MfJs.Elements['listbox-multiple'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="col {{ class }}" {{ attr }}>
    {{ el.actions }}
    {{ el.title }}
    <select id="tv{{ id }}" name="{{ name }}" placeholder="{{ placeholder }}" multiple="multiple" onchange="documentDirty=true;" size="8">{{ el.elements }}</select>
</div>`,
    element: `<option value="{{ value }}" {{ selected }}>{{ title }}</option>`,
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
