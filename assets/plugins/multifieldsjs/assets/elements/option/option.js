/**
 * @version 1.0
 */
MfJs.Elements['option'] = {
  template: '' +
      '<div id="[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      ' [+actions+]\n' +
      ' [+title+]\n' +
      ' [+input+]\n' +
      '</div>',

  input: '<input type="radio" value="[+value+]" id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" [+checked+] onchange="documentDirty=true;" /><label for="tv[+id+]" class="radio">[+title+]</label>',
};