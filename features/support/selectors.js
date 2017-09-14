var _ = require('underscore.string');

var selectors = {
  '^(.+) within (.+)$': function(innerSelector, outerSelector) {
    return (selectorFor(outerSelector)) + ' ' + (selectorFor(innerSelector));
  },

   // Paths
  '^the home page$': '/',

  '^the (.*) page$': function(page) {
     return '/' + page;
   },

  // static elements
  'the page': 'body',

  // api endpoints
  'the me endpoint': '/v1/me',

  '^the (.+) (.+) endpoint': function(resource, subResource) {
    return resource + '/' + subResource;
  },
  // Fallthrough
  '^the (.+) section': function(className) {
    var camelClassName = className.replace(' ', '-');
    return '.'+ camelClassName;
  },
  '^the (.+) element': function(elementName) {
    return elementName.replace(/ /g, '-');
  },
  '^the (.+) input': function(inputName) {
    return 'input[name="' + _.camelize(inputName) + '"]';
  },
  '^the (.+) option(?: in (.*))?$': function(optionValue, selectName) {
    var selectSelector = selectorFor(selectName);
    return selectSelector + ' option[value="' + optionValue + '"]';
  },
  '^the (.+) drop down': function(inputName) {
    return 'select[name="' + _.camelize(inputName) + '"]';
  },
  '^the (.+) drop down': function(className) {
    return 'md-select.' + className.replace(/ /g , '-');
  },
  '^the radio with value "(.*)"': function(inputName) {
    return 'input[value="' + inputName + '"]';
  }
}

var selectorFor = function (locator) {
  var match, path, regexp, selector;

  for (regexp in selectors) {
    path = selectors[regexp];
    if (match = locator.match(new RegExp(regexp))) {
      selector = typeof path === 'string' ? path : path.apply(this, match.slice(1));
      return selector;
    }
  }
};

module.exports.selectorFor = selectorFor;
