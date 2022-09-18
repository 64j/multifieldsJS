/**
 * @version 1.0
 */
MfJs.Elements['textarea'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="col {{ class }}" {{ attr }}>
    {{ el.actions }}
    {{ el.title }}
    <textarea type="text" id="tv{{ id }}" class="form-control {{ item.class }}" name="tv{{ id }}"
              placeholder="{{ placeholder }}" onchange="documentDirty=true;" {{ item.attr }}>{{ value }}</textarea>
</div>`,
  },
}
