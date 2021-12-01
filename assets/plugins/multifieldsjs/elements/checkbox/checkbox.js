MfJs.add('checkbox', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      ' [+actions+]\n' +
      ' [+title+]\n' +
      ' [+input+]\n' +
      '</div>',

  input: '<label class="checkbox"><input type="[+type+]" value="[+value+]" id="tv[+id+]" name="[+name+][]" placeholder="[+placeholder+]"  [+checked+] onchange="documentDirty=true;" />[+title+]</label><br />'
});