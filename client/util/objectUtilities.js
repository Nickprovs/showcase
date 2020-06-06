export default class ObjectUtilities {
  static GetPropertyFromPath(obj, path) {
    let i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    return obj[path[i]];
  }

  static SetPropertyAtPath(obj, value, path) {
    let i;
    path = path.split(".");
    for (i = 0; i < path.length - 1; i++) obj = obj[path[i]];
    obj[path[i]] = value;
  }

  static DeletePropertyAtPath(obj, path) {
    if (!obj || !path) {
      return;
    }

    if (typeof path === "string") {
      path = path.split(".");
    }

    for (var i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];

      if (typeof obj === "undefined") {
        return;
      }
    }

    delete obj[path.pop()];
  }
}
