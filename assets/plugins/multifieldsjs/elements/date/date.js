MfJs.add('date', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <input type="text" id="tv[+id+]" name="tv[+id+]" class="form-control DatePicker unstyled [+item.class+]" value="[+value+]" placeholder="[+placeholder+]" onblur="documentDirty=true;" autocomplete="off" [+item.attr+]>\n' +
      '    <i class="fa fa-calendar-times-o" onclick="this.previousElementSibling.value=\'\';"></i>\n' +
      '</div>',

  initElement: function(id) {
    if (typeof DatePicker !== 'undefined') {
      let el = document.querySelector('#' + id + ' .DatePicker');
      if (el) {
        let format = el.getAttribute("data-format");
        new DatePicker(el, {
          yearOffset: dpOffset,
          format: format !== null ? format : dpformat,
          dayNames: dpdayNames,
          monthNames: dpmonthNames,
          startDay: dpstartDay
        });
      }
    }
  }
});