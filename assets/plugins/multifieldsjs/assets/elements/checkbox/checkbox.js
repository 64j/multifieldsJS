/**
 * @version 1.0
 */
MfJs.Elements['checkbox'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="col {{ class }}" {{ attr }}>
    {{ el.actions }}
    {{ el.title }}
    {{ el.elements }}
</div>`,
    element: `
<label class="checkbox">
    <input type="{{ type }}" value="{{ value }}" id="{{ id }}" name="{{ name }}[]" placeholder="{{ placeholder }}" {{ checked }} onchange="documentDirty=true;"/>{{ title }}</label>
<br/>`,
  },

  Render: {
    data (data) {
      if (data.elements) {
        let values = data.value.split('||')
        data.el.elements = ''
        data.elements.forEach((item, index) => {
          data.el.elements += MfJs.Render.template([data.type, 'element'], {
            id: data.id + '_' + index,
            type: data.type,
            name: data.id,
            value: item.value,
            title: item.key !== '' && item.key || item.value,
            selected: ~values.indexOf('' + item.value) ? 'selected' : '',
            checked: ~values.indexOf('' + item.value) ? 'checked' : ''
          })
        })
      }

      return data
    },
  },
}
