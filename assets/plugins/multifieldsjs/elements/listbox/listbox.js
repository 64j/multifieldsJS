MfJs.add('listbox', {
  template: '' +
      '<div id="mfjs[+id+]" class="col [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <select id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" size="8">[+input+]</select>\n' +
      '</div>',

  input: '<option value="[+value+]" [+selected+]>[+title+]</option>'
});