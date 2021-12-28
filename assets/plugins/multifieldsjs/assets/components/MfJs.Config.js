/**
 * @version 1.0
 */
MfJs.Config = new function() {
  let Config = function() {};

  Config.prototype.add = function(config) {
    this[MfJs.Container.id] = config;
  };

  Config.prototype.get = function(key) {
    return this?.[MfJs.Container.id]?.[key] || this[MfJs.Container.id] || null;
  };

  Config.prototype.find = function(name, parents) {
    let templates = MfJs.Config.get('templates'),
        config = {};
    if (parents && parents.length > 1 && !templates[name]) {
      parents = parents.map(function(el) {
        return el.dataset.name;
      });
      config = MfJs.Config.findChildren(templates, parents);
      config.name = name;
    } else {
      if (templates[name]) {
        templates[name].name = name;
        config = templates[name];
      } else if (name === null) {
        config = MfJs.Config.get();
      }
    }

    return config;
  };

  Config.prototype.findChildren = function(data, parents) {
    let a = {};
    let key = parents.pop();
    for (let k in data) {
      if (data.hasOwnProperty(k) && k === key) {
        if (parents.length) {
          if (data[k]['items']) {
            if (MfJs.Elements[data[k]['type']]?.Config?.findChildren) {
              data[k]['items'] = MfJs.Elements[data[k]['type']].Config.findChildren(data[k]['items']);
            }
            a = MfJs.Config.findChildren(data[k]['items'], parents);
          } else if (data[k]['templates']) {
            a = MfJs.Config.findChildren(Object.keys(data[k]['templates']).reduce(function(obj, key) {
              obj[data[k]['templates'][key]] = MfJs.Config.get('templates')[data[k]['templates'][key]] || {};
              return obj;
            }, {}), parents);
          } else {
            a = data[k];
            break;
          }
        } else {
          a = data[k];
          break;
        }
      }
    }

    return a;
  };

  return new Config();
};
