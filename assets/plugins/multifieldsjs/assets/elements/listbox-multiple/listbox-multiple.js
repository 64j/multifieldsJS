/**
 * @version 1.0
 */
MfJs.Elements['listbox-multiple'] = {
  template: '' +
      '<div id="[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <select id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" multiple="multiple" onchange="documentDirty=true;" size="8">[+input+]</select>\n' +
      '</div>',

  input: '<option value="[+value+]" [+selected+]>[+title+]</option>',
};
