/**
 * @version 1.0
 */
MfJs.Elements['rawtextarea'] = {
  templates: {
    wrapper: '' +
        '<div id="[+id+]" class="col [+class+]" [+attr+]>\n' +
        '    [+el.actions+]\n' +
        '    [+el.title+]\n' +
        '    <textarea type="text" id="tv[+id+]" class="form-control [+item.class+]" name="tv[+id+]" placeholder="[+placeholder+]" onchange="documentDirty=true;" [+item.attr+]>[+value+]</textarea>\n' +
        '</div>',
  },
};
