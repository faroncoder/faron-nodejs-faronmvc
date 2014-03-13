
var _ = require('underscore');
require('./matchers');

describe("GrowlReporter", function() {

  var injector = require('../lib/reporter').inject,
      growl = null,
      reporter = null;

  var fakeSpecResult = function(passed) {
    return {
      status: passed ? 'passed' : 'failed'
    };
  };

  var pendingSpecResult = function() {
    return {
      status: 'pending'
    };
  };

  var title = 'Jasmine',
      passedRegexp = /^PASSED in [\d\.]+s$/,
      failedRegexp = /^FAILED in [\d\.]+s$/;

  beforeEach(function() {
    growl = jasmine.createSpy();
    reporter = new (injector({ growl: growl }))();
  });

  it("should report 0 results", function() {
    reporter.jasmineStarted();
    reporter.jasmineDone();
    expect(growl).toHaveNotified('0 tests', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 2 successful results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('2 tests, 0 failed', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 3 failed results", function() {
    reporter.jasmineStarted();
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('3 tests, 3 failed', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 2 passed and 4 failed results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('6 tests, 4 failed', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 3 pending results", function() {
    reporter.jasmineStarted();
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('3 tests, 0 failed, 3 pending', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 1 passed and 2 pending results", function() {
    reporter.jasmineStarted();
    _.times(1, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('3 tests, 0 failed, 2 pending', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 4 pending and 5 failed results", function() {
    reporter.jasmineStarted();
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    _.times(5, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('9 tests, 5 failed, 4 pending', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 2 passed, 3 pending and 4 failed results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('9 tests, 4 failed, 3 pending', {
      name: title,
      title: failedRegexp
    });
  });
});
