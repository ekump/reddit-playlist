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

  // Fallthrough
  '^the (.+) section': function(className) {
    var camelClassName = _.camelize(className.replace(' ', '-'));
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