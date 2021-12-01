/**
 * @version 1.0
 */
MfJs.add('file', {
  template: '' +
      '<div id="mfjs[+id+]" class="col input-group [+class+]" data-type="[+type+]" data-name="[+name+]" [+attr+]>\n' +
      '    [+actions+]\n' +
      '    [+title+]\n' +
      '    <input type="text" id="tv[+id+]" class="form-control [+item.class+]" name="[+name+]" placeholder="[+placeholder+]" value="[+value+]" onchange="documentDirty=true;" [+item.attr+]>\n' +
      '    <i class="far fa-file" onclick="BrowseFileServer(\'tv[+id+]\');"></i>\n' +
      '</div>'
});
