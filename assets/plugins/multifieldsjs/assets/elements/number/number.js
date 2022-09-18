/**
 * @version 1.0
 */
MfJs.Elements['number'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="col {{ class }}" {{ attr }}>
    {{ el.actions }}
    {{ el.title }}
    <input type="number" id="tv{{ id }}" class="form-control {{ item.class }}" name="tv{{ id }}" value="{{ value }}" placeholder="{{ placeholder }}" onchange="documentDirty=true;" {{ item.attr }}>
</div>`,
  },
}
