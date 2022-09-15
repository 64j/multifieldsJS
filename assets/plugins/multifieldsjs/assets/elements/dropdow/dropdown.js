/**
 * @version 1.0
 */
MfJs.Elements['dropdown'] = {
  templates: {
    wrapper: '' +
      '<div id="{{ id }}" class="col {{ class }}" {{ attr }}>\n' +
      '    {{ el.actions }}\n' +
      '    {{ el.title }}\n' +
      '    <select id="tv{{ id }}" name="{{ name }}" placeholder="{{ placeholder }}" size="1" onchange="documentDirty=true;">{{ el.elements }}</select>\n' +
      '</div>',
    element: '<option value="{{ value }}" {{ selected }}>{{ title }}</option>',
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
