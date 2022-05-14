const isObjectOrArray = (obj) => {
  const identifier = Object.prototype.toString.call(obj);
  return identifier === "[object Object]" || identifier === "[object Array]";
};

const handler = (instance) => ({
  get: function(obj, prop) {
    if (isObjectOrArray(obj[prop])) {
      return new Proxy(obj[prop], handler(instance));
    }
    return obj[prop];
  },
  set: function(obj, prop, value) {
    obj[prop] = value;
    instance.render();

    return true;
  },
  deleteProperty: function(obj, prop) {
    delete obj[prop];
    instance.render();
    return true;
  },
});

export const dataProxy = (data, component) => {
  return new Proxy(data || {}, handler(component))
}
