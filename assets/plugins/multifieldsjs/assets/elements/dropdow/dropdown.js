/**
 * @version 1.0
 */
MfJs.Elements['dropdown'] = {
  template: '' +
      '<div id="[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <select id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" size="1" onchange="documentDirty=true;">[+input+]</select>\n' +
      '</div>',

  input: '<option value="[+value+]" [+selected+]>[+title+]</option>',
};
