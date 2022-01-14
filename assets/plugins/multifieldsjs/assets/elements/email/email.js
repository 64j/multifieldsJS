/**
 * @version 1.0
 */
MfJs.Elements['email'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
        '    [+el.actions+]\n' +
        '    [+el.title+]\n' +
        '    <input type="[+type+]" id="tv[+id+]" name="[+name+]" placeholder="[+placeholder+]" value="[+value+]" tvtype="[+type+]" onchange="documentDirty=true;" style="width:100%"/>\n' +
        '</div>',
  },
};
