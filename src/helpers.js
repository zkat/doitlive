"use strict";

var _ = require("lodash"),
    $ = require("jquery"),
    doitlive = require("./index.js");

function inner(key, escape) {
  var modifier = escape ? "text" : "html";
  if (typeof key === "string") {
    return function(el, data) {
      el[modifier](data[key]);
    };
  } else if (typeof key === "object") {
    return function(el, data) {
      _.each(key, function(v, k) {
        inner(k, escape)(el.find(v), data);
      });
    };
  } else {
    throw new Error("Invalid key");
  }
}

function each(key, mapping) {
  return function(el, data) {
    var tmpl = el.children();
    tmpl.remove();
    _.forEach(data[key], function(subData, subKey) {
      var newChild = tmpl.clone();
      newChild.appendTo(el);
      doitlive.compile(newChild, mapping)(_.extend({
        "@index": subKey,
        "@key": subKey
      }, subData));
    });
  };
}

module.exports = {
  inner: inner,
  text: _.partialRight(inner, true),
  html: _.partialRight(inner, false),
  each: each
};
