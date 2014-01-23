"use strict";

var _ = require("lodash"),
    $ = require("../bower_components/jquery/jquery.js"),
    helpers = require("./helpers");

var sortAttributes = makeAttributeSorter();

/*
 * The order of Node.attributes isn't specified in the html spec, so we detect
 * it on a per-browser basis and hope they're at least not jumbled. Chrome, for
 * example, keeps them in order, whereas Firefox reverses their order.
 */
function makeAttributeSorter() {
  var div = document.createElement("div");
  div.innerHTML = "<div foo bar baz></div>";
  var attributesInOrder = !_.isEqual(div.children[0].attributes,
                                     ["foo", "bar", "baz"]);
  return _.constant(attributesInOrder ? 0 : 1);
}

function compile(html, mapping) {
  var tmplDom = $(html);
  mapping = flattenMapping(expandMapping(mapping));
  return function(data) {
    var frag = document.createDocumentFragment(),
        div = $("div");
    div.append(tmplDom.clone());
    applyMapping(div, data, mapping);
    frag.append(div.children());
    return frag;
  };
}

function expandMapping(mapping) {
  return _.mapValues(mapping, function(val) {
    switch (typeof val) {
    case "function":
      return val;
    case "object":
      return expandMapping(val);
    default:
      throw new Error("Unexpected value mapping");
    }
  });
}
function flattenMapping(mapping) {
  return _.reduce(mapping, function(acc, val, key) {
    if (typeof val === "object") {
      _.forEach(flattenMapping(val), function(subVal, subKey) {
        acc[key + " " + subKey] = subVal;
      });
    } else {
      acc[key] = val;
    }
    return acc;
  }, {});
}

function applyMapping(el, data, mapping) {
  _.forEach(mapping, function(handler, selector) {
    handler(el.find(selector), data);
  });
}

var exampleData = {
  title: "Hello, world!",
  post: {
    text: "This is a post. Hi there!",
    date: "today"
  },
  comments: [{
    name: "Jane",
    text: "I enjoy this post."
  },{
    name: "John",
    text: "omg me too!"
  }]
};

var exampleMapping = {
  h1: helpers.text("title"),
  // TODO - convert a.b.c to some helper?
  p: helpers.text("post.text"),
  ol: helpers.each("comments", {
    ".comment": {
      "> span": helpers.text("@index"),
      "> h4 > span": helpers.text("name"),
      "> p": helpers.text("text")
    }
  })
};

var exampleHtml = ''+
      '<h1></h1>'+
      '<p></p>'+
      '<ol>'+
      '  <li class=comment>'+
      '    <span></span>'+
      '    <h4>@<span></span></h4>'+
      '    <p></p>'+
      '</ol>'+
      '';

module.exports = {
  compile: compile
};
