var $div, $sp, $t, D, Node, d,
  __slice = Array.prototype.slice;

d = document;

Node = (function() {
  var dotHashRe, flattenHash, joinValues, parseElem;

  Node.prototype._brew = 1;

  flattenHash = function(attr) {
    var name, obj, sub, val;
    for (name in attr) {
      obj = attr[name];
      if (typeof attr[name] === 'object') {
        for (sub in obj) {
          val = obj[sub];
          attr[name + '-' + sub.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()] = val;
        }
        delete attr[name];
      }
    }
  };

  dotHashRe = /[.#]/;

  parseElem = function(elem, attr) {
    var classes, elemType, piece, pieces, pos, _i, _len;
    if (!dotHashRe.test(elem)) return elem;
    attr['class'] || (attr['class'] = []);
    if (typeof attr['class'] === 'string') attr['class'] = [attr['class']];
    if (dotHashRe.test(elem.charAt(0))) elem = "div" + elem;
    pieces = elem.split(dotHashRe);
    elemType = pieces.shift();
    pos = elemType.length;
    classes = attr['class'];
    for (_i = 0, _len = pieces.length; _i < _len; _i++) {
      piece = pieces[_i];
      if (elem.charAt(pos) === '#') {
        attr['id'] = piece;
      } else {
        classes.push(piece);
      }
      pos += piece.length + 1;
    }
    if (!attr['class'].length) delete attr['class'];
    return elemType;
  };

  joinValues = function(value) {
    var i, length, r;
    if (typeof value !== 'object') return value;
    r = [];
    i = -1;
    length = value.length;
    while (++i < length) {
      if (value[i]) r.push(value[i]);
    }
    return r.join(' ');
  };

  function Node(elem, attr, more) {
    var css, name, prop, s, value;
    if (!(attr != null)) attr = {};
    if (elem.nodeType) {
      this.e = elem;
      return;
    } else if (elem === 'text') {
      this.e = d.createTextNode(attr);
      return;
    } else {
      if (typeof attr === "string") {
        more || (more = {});
        more.text = attr;
        attr = more;
      }
      this.e = d.createElement(parseElem(elem, attr));
    }
    attr['class'] && (this.e.className = joinValues(attr['class'])) && delete attr['class'];
    attr['text'] && (this.e.innerText = joinValues(attr['text'])) && delete attr['text'];
    attr['html'] && (this.e.innerHTML = joinValues(attr['html'])) && delete attr['html'];
    if (attr['css'] && (s = this.e.style) && (css = attr['css']) && delete attr['css']) {
      for (prop in css) {
        value = css[prop];
        s[prop] = value;
      }
    }
    flattenHash(attr);
    for (name in attr) {
      value = attr[name];
      this.e.setAttribute(name, value);
    }
  }

  Node.prototype.append = function() {
    var a, i, node, tmp, _i, _len, _len2;
    a = arguments;
    for (i = 0, _len = a.length; i < _len; i++) {
      node = a[i];
      if (typeof node === "string") a[i] = window.$t(node);
    }
    if ("splice" in a[0]) a = a[0];
    tmp = this.e;
    for (_i = 0, _len2 = a.length; _i < _len2; _i++) {
      node = a[_i];
      ('_brew' in node) && (node = node.dom());
      this.e.appendChild(node);
      this.e = tmp;
    }
    return this;
  };

  Node.prototype.c = Node.prototype.append;

  Node.prototype.prepend = function() {
    var a, i, node, tmp, _i, _len, _len2;
    a = arguments;
    for (i = 0, _len = a.length; i < _len; i++) {
      node = a[i];
      if (typeof node === "string") a[i] = window.$t(node);
    }
    if ("splice" in a[0]) a = a[0];
    tmp = this.e;
    for (_i = 0, _len2 = a.length; _i < _len2; _i++) {
      node = a[_i];
      ('_brew' in node) && (node = node.dom());
      this.e.insertBefore(node, this.e.firstChild);
      this.e = tmp;
    }
    return this;
  };

  Node.prototype.sp = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.append([window.$sp.apply(window, args)]);
    this.d;
    return this;
  };

  Node.prototype.div = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.append([window.$div.apply(window, args)]);
    this.d;
    return this;
  };

  Node.prototype.t = function(text) {
    return this.append(text);
  };

  Node.prototype.u = function() {
    this.e = this.e.parentNode;
    return this;
  };

  Node.prototype.d = function() {
    this.e = this.e.lastChild;
    return this;
  };

  Node.prototype.dom = function() {
    return this.e;
  };

  Node.prototype.text = function() {
    return this.e;
  };

  Node.prototype.html = function() {
    var div;
    div = d.createElement('div');
    div.appendChild(this.e);
    return div.innerHTML;
  };

  return Node;

})();

Node.prototype.asDOM = Node.prototype.dom;

Node.prototype.asHTML = Node.prototype.html;

this.DOMBrew = D = function() {
  var a, frag, node, nodes, _i, _len;
  a = arguments;
  if ((typeof a[0] === 'object') && ('splice' in a[0])) {
    nodes = a[0];
  } else if (a.length > 1 && (typeof a[1] === 'object') && ('_brew' in a[1])) {
    nodes = a;
  }
  if (nodes) {
    frag = d.createDocumentFragment();
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      frag.appendChild(node.e);
    }
    a = [frag];
  }
  return new Node(a[0], a[1], a[2]);
};

D.VERSION = D.version = '1.4.3';

$sp = function() {
  var arg1, args;
  arg1 = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return D.apply(null, ["span" + arg1].concat(__slice.call(args)));
};

$div = function() {
  var arg1, args;
  arg1 = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return D.apply(null, ["div" + arg1].concat(__slice.call(args)));
};

$t = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return D.apply(null, ["text"].concat(__slice.call(args)));
};

if ((navigator.appName !== 'Microsoft Internet Explorer') && !HTMLElement.prototype.innerText && HTMLElement.prototype.__defineGetter__) {
  HTMLElement.prototype.__defineGetter__("innerText", function() {
    return this.textContent;
  });
  HTMLElement.prototype.__defineSetter__("innerText", function(value) {
    return this.textContent = value;
  });
}
