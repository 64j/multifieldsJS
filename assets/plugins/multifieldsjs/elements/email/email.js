/**
 * @version 1.0
 */
MfJs.add('email', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <input type="[+type+]" id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" value="[+value+]" tvtype="[+type+]" onchange="documentDirty=true;" style="width:100%"/>\n' +
      '</div>'
});
