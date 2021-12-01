/**
 * @version 1.0
 */
MfJs.add('rawtextarea', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <textarea type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>[+value+]</textarea>\n' +
      '</div>'
});
