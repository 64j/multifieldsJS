/**
 * @version 1.0
 */
MfJs.Config = new function () {
  let Config = function () {}

  Config.prototype.add = function(config) {
    this[MfJs.Container.id] = config;
  };

  Config.prototype.get = function(key) {
    return this?.[MfJs.Container.id]?.[key] || this[MfJs.Container.id] || null;
  };

  Config.prototype.find = (name, parents) => {
    let templates = MfJs.Config.get('templates'), config = {}
    if (parents && parents.length > 1 && !templates[name]) {
      parents = parents.map(el => el.dataset.name)
      config = MfJs.Config.findChildren(templates, parents)
      config.name = name
    } else {
      if (templates[name]) {
        templates[name].name = name
        config = templates[name]
      } else if (name === null) {
        config = MfJs.Config.get()
      }
    }

    return config
  }

  Config.prototype.findChildren = (data, parents) => {
    let a = {}
    let key = parents.pop()
    for (let k in data) {
      if (k === key) {
        let item = data[k]
        a = item
        if (parents.length) {
          if (item.items) {
            if (MfJs.Elements[item.type]?.Config?.findChildren) {
              item.items = MfJs.Elements[item.type].Config.findChildren(item.items)
            }
            a = MfJs.Config.findChildren(item.items, parents)
          } else if (item.templates) {
            a = MfJs.Config.findChildren(Object.keys(item.templates).reduce((obj, key) => {
              obj[item.templates[key]] = MfJs.Config.get('templates')[item.templates[key]] || {}
              return obj
            }, {}), parents)
          } else {
            break
          }
        } else {
          break
        }
      }
    }

    return a
  }

  return new Config()
}
