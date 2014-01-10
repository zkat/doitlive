"use strict";

var _ = require("lodash"),
	$ = require("jquery"),
	helpers = require("./helpers");

var exampleData = {
	title: "Hello, world!",
	post: "This is a post. Hi there!",
	comments: [{
		name: "Jane",
		text: "I enjoy this post."
	},{
		name: "John",
		text: "omg me too!"
	}]
};

// Mappings can be defined in javascript...
var exampleMapping = {
	"h1": "title",
	"p": "post",
	"ol": helpers.each("comments", {
		"li": {
			".name": "name",
			".text": "text"
		}
	})
};

// ...or directly in the html, where each dil-* refers to a value in the
// passed-in helper object (TODO), which should be a function with type key
// -> mapping -> domUpdate

// TODO - what to do about <script> elements? If you put one in your
// template, it will execute at least once even if the parent is going to
// remove it.
var exampleHtml = ''+
		'<h1 dil-text=title></h1>'+
		'<p dil-text=post></p>'+
		'<ol dil-each=comments>'+
		'  <li class=comment>'+
		'    <span dil-text=dil-each-index></span>'+
		// If you don't want to insert an html element, use a fragment
		// custom tag from can.Component or similar. Note that it'll need
		// to be cloneable?
		'    <h4>@<fragment dil-text=name></fragment></h4>'+
		'    <p dil-text=text></p>'+
		// Hooray no </li>! Perfectly legal! Renders according to browser.
		'</ol>'+
		'';

// Pretend-Python
render = _.curry(render);
function render(html, mapping, data) {
	var frag = document.createDocumentFragment();
	$(frag).html(html);
	_.forEach(flattenMapping(expandMapping(mapping)), function(handler, selector) {
		handler(selector, data);
	});
}

function expandMapping(mapping) {
	return _.mapValues(mapping, function(val) {
		switch (typeof val) {
			case "function":
			return val;
			case "object":
			return expandMapping(val);
			default:
			return helpers.text(val);
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

module.exports = {
	render: render
};
