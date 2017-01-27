var expect = require('chai').expect,
    localtunnel = require('localtunnel'),
    config = require('../../config'),
    selectorFor = require('../support/selectors').selectorFor,
    data = require('../support/data'),
    path = require('path');

module.exports = function () {
  this.Then(/^(?:I pause|show me the page)$/, { timeout: 1000 * 60 * 60 }, function (next) {
    console.log('pausing....');
  });

  this.Given(/^I (?:am on|go to) (.+)$/, function(namedElement, next) {
    browser.get(selectorFor(namedElement));
    next();
  });

  this.Given(/^I tunnel$/, function (next) {
    localtunnel(config.port, function(err, tunnel) {
      if (err) { return next(err); }
      console.log(tunnel.url);
      next();
    });
  });

  this.Then(/^I should( not)? see "([^"]*)" in (.+)$/, function (negator, expectedText, namedElement, next) {
    var el = $(selectorFor(namedElement));
    el.isPresent().then(function (isPresent) {
      expect(isPresent).to.be.true;
      el.getText().then(function (actualText) {
        var expectation = expect(actualText.toLowerCase());
        if (negator) { expectation = expectation.not; }
        expectation.to.include(expectedText.toLowerCase());
        next();
      });
    });
  });

  this.Then(/^I should( not)? see ([^"]*) on the page$/, function (negator, namedElement, next) {
    var el = $(selectorFor(namedElement));
    el.isPresent().then(function (isPresent) {
      var expectation = negator ? 'false' : 'true';
      expect(isPresent).to.be[expectation]
      next()
    });
  });

  this.When(/^I click( the link)? (.+)$/, function(isLink, namedElement) {
    var el;

    if (isLink) {
      el = browser.driver.findElement(by.linkText(namedElement));
    } else {
      el = element.all(by.css(selectorFor(namedElement))).first();
    }

    return el.click();
  });

  this.When(/^I should be on (.+)$/, function(namedElement) {
    return browser.waitForAngular().then(function () {
      return expect(browser.getCurrentUrl()).to.eventually.contain(selectorFor(namedElement));
    });
  });

  this.When(/^I wait (\d+)(?:.*)?$/, { timeout: (30 * 60 * 1000) }, function (seconds, next) {
    setTimeout(next, seconds * 1000);
  });

  this.When(/^I enter "([^"]*)" in (.+)$/, function(value, namedElement, next) {
    var selector = selectorFor(namedElement);

    $(selector).clear().then(function() {
      $(selector).sendKeys(value).then(next);
    });
  });

  this.Then(/^(.+) should( not)? be displayed$/, function(namedElement, negation, next) {
    var selector = selectorFor(namedElement);

    $(selector).isDisplayed().then(function(isDisplayed) {
      if (negation) {
        expect(isDisplayed).to.be.false;
      } else {
        expect(isDisplayed).to.be.true;
      }
      next();
    });
  });

  this.When(/^I unwip everything$/, function(next) {
    var unwip = function () {
      document.querySelectorAll('.wip').forEach(function(element) {
        element.classList.remove('wip');
      });
    };

    browser.driver.executeScript(unwip).then(next);
  });

  this.Then(/^(.+) should( not)? have value "(.+)"$/, function(namedElement, negator, expected, next) {
    var selector = selectorFor(namedElement);
    var checkVal = function() {
      return document.querySelector(arguments[0]).value;
    }

    browser.driver.executeScript(checkVal, selector).then(function(val) {
      if (negator) {
        expect(val).to.equal('');
      } else {
        expect(val).to.equal(expected);
      }
      next();
    });
  });

  this.Then(/^(.+) should( not)? be checked$/, function(namedElement, negator, next) {
    var selector = selectorFor(namedElement);
    var checkVal = function() {
      return document.querySelector(arguments[0]).checked;
    }

    browser.driver.executeScript(checkVal, selector).then(function(val) {
      if (negator) {
        expect(val).to.be.false;
      } else {
        expect(val).to.be.true;
      }
      next();
    });
  });
}