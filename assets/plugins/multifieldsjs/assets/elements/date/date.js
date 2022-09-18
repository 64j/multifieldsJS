/**
 * @version 1.0
 */
MfJs.Elements['date'] = {
  templates: {
    wrapper: `
<div id="{{ id }}" class="col {{ class }}" {{ attr }}>
    {{ el.actions }}
    {{ el.title }}
    <input type="text" id="tv{{ id }}" name="tv{{ id }}" class="form-control DatePicker unstyled {{ item.class }}" value="{{ value }}" placeholder="{{ placeholder }}" onblur="documentDirty=true;" autocomplete="off" {{ item.attr }}>
    <i class="fa fa-calendar-times-o" onclick="this.previousElementSibling.value='';"></i>
</div>`,
  },

  Render: {
    init (id) {
      if (typeof DatePicker !== 'undefined') {
        let el = document.querySelector('#' + id + ' .DatePicker')
        if (el) {
          let format = el.getAttribute('data-format')
          new DatePicker(el, {
            yearOffset: dpOffset,
            format: format !== null ? format : dpformat,
            dayNames: dpdayNames,
            monthNames: dpmonthNames,
            startDay: dpstartDay,
          })
        }
      }
    },
  },
}
