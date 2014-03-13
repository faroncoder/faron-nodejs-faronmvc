
exports.inject = function(deps) {

  deps = deps || {};
  var growl = deps.growl || require('growl');

  var GrowlReporter = function() {
  };

  GrowlReporter.prototype = {

    jasmineStarted: function() {
      this.startedAt = new Date();
      this.counts = {
        failed: 0,
        pending: 0,
        total: 0
      };
    },

    specStarted: function() {
      this.counts.total++;
    },

    specDone: function(spec) {
      switch (spec.status) {
        case 'pending':
          this.counts.pending++;
          break;
        case 'failed':
          this.counts.failed++;
          break;
      }
    },

    jasmineDone: function() {

      growl(growlMessage(this.counts), {
        name: growlName,
        title: growlTitle(this.counts, this.startedAt)
      });
    }
  };

  var growlName = 'Jasmine';

  var growlTitle = function(counts, startedAt) {
    
    var title = counts.failed ? 'FAILED' : 'PASSED';
    title += ' in ' + ((new Date().getTime() - startedAt.getTime()) / 1000) + 's';

    return title;
  };

  var growlMessage = function(counts) {

    var description = counts.total + ' tests';

    if (counts.total) {
      description += ', ' + counts.failed + ' failed';
    }

    if (counts.pending) {
      description += ', ' + counts.pending + ' pending';
    }

    return description;
  };

  return GrowlReporter;
};
