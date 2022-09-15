/**
 * @version 1.0
 */
MfJs.Elements['number'] = {
  templates: {
    wrapper: '' +
      '<div id="{{ id }}" class="col {{ class }}" {{ attr }}>\n' +
      '    {{ el.actions }}\n' +
      '    {{ el.title }}\n' +
      '    <input type="number" id="tv{{ id }}" class="form-control {{ item.class }}" name="tv{{ id }}" value="{{ value }}" placeholder="{{ placeholder }}" onchange="documentDirty=true;" {{ item.attr }}>\n' +
      '</div>',
  },
}
