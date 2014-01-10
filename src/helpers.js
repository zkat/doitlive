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
    var div = $("<div>");
    div.append(el.children());
    _.forEach(data[key], function(subData, subKey) {
      var frag = document.createDocumentFragment();
      $(frag).append(div.clone().children());
      doitlive.render(frag, mapping, _.extend({
        "dil-each-index": subKey,
        "dil-each-key": subKey
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
