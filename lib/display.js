
module.exports = function(undefined) {
    var sys = require('sys');
    var pub = {};
    var cfg = {};
    cfg.type = 'console';
    var _ = {};
    var c = require('./colors');
    console.log(c.reset); // reset colors
    var passed = c.green + 'passed' + c.reset;
    var failed = c.red + 'failed' + c.reset;



    pub.linebreak = function() {
        _.linebreak[cfg.type]();
    };
    _.linebreak = {};
    _.linebreak.console = function() {
        sys.puts("\n");
    };

    pub.begin = function(num_suites, total_tests) {
        _.begin[cfg.type](num_suites, total_tests);
    };
    _.begin = {};
    _.begin.console = function(num_suites, total_tests) {
        sys.puts("\nrunning... "+num_suites+" suites, "+total_tests+" tests.");
    };


    pub.print = function(msg) {
        _.print[cfg.type](msg);
    };
    _.print = {};
    _.print.console = function(msg) {
        sys.print(msg+"\n");
    };

    /*
    * Suite info display functions
    */
    pub.suiteBorder = function() {
        _.suiteBorder[cfg.type]();
    };
    _.suiteBorder = {};
    _.suiteBorder.console = function() {
        sys.print("\n\n\n==========\n= ");
    };

    // test or suite details
    pub.details = function(name, o) {
        _.details[cfg.type](name, o);
    };
    _.details = {};
    _.details.console = function(name, o) {
        if (name === 'suite') {
            if (typeof o.name !== 'undefined') {
                sys.print(c.cyan + o.name + c.reset + ' - ');
            }
            sys.print(c.purple + o.desc + c.reset );
        } else {
            console.log("\n- " + '[' + o.parent.position +
                    '/' + o.position + '] test ' + c.reset +
                    c.purple + o.desc + c.reset);
        }
    };
    pub.beforeEach = function() {
        _.beforeEach[cfg.type]();
    };
    _.beforeEach = {};
    _.beforeEach.console = function() {
        sys.print(' ... suite beforeEach ... ');
    };
    pub.afterEach = function() {
        _.afterEach[cfg.type]();
    };
    _.afterEach = {};
    _.afterEach.console = function() {
        sys.print("... suite afterEach ... ");
    };

    // setup intro
    pub.setup = function(name) {
        _.setup[cfg.type](name);
    };
    _.setup = {};
    _.setup.console = function(name) {
        if (name === 'suite') {
            sys.print("\n= setup ... ");
        } else {
            sys.print('- test setup ... ');
        }
    };

    // takedowns
    pub.takedown = function(name) {
        _.takedown[cfg.type](name);
    };
    _.takedown = {};
    _.takedown.console = function(name) {
        if (name === 'suite') {
            sys.print("... suite takedown ... ");
        } else {
            sys.print("\n- test takedown ... ");
        }
    };

    _.mergeMessages = {};
    _.mergeMessages.console = function(o, type) {
        var msg = '';
        if (o[type].failmsg) {
            msg = 'failed (' + o[type].failmsg + ')';
        } else {
            msg = 'failed';
        }
        return msg + " " + c.yellow + o[type]._message + c.reset;
    };


    /*
    * test results
    */
    pub.fail = function(o, type) {
        var msg = _.mergeMessages[cfg.type](o, type);
        _.fail[cfg.type](o, type, msg);
    };
    _.fail = {};
    _.fail.console = function(o, type, msg) {
        if (type === 'actual') {
            sys.puts(c.red + msg + c.reset);
        } else {
            sys.puts("\n" + c.redbg + ' FAIL' + c.reset + ' ' + c.cyan + o.name  +
                 c.reset + ' test ' + c.red + msg + c.reset);
        }
    };

    pub.pass = function(o, type) {
        _.pass[cfg.type](o, type);
    };
    _.pass = {};
    _.pass.console = function(o, type) {
        if (type === 'actual') {
            sys.print("\n" + c.greenbg + '  OK ' + c.reset + ' ' + c.cyan + o.name  +
                        c.reset + ' test' + c.green + ' passed' + c.reset);
        } else {
            sys.print(c.blue + 'completed ' + c.reset);
        }
    };


    /*
    * summary displays
    */
    pub.summary = function(num_suites, summary) {
        _.summary[cfg.type](num_suites, summary);
    };
    _.summary = {};
    _.summary.console = function(num_suites, summary) {
        console.log("\n\nSummary\n=======\n");
        sys.print('scaffolding report  ');
        sys.puts(c.red+summary.scaffolding.failed+c.reset+' failed,  ' +
                  c.green+summary.scaffolding.passed+c.reset+' passed, '+
                  c.cyan+summary.scaffolding.skipped+c.reset+' skipped, '+
                  c.blue+summary.scaffolding.total+c.reset+' total.');
        sys.print('       test report  ');
        sys.puts(c.red+summary.tests.failed+c.reset+' failed,  ' +
                  c.green+summary.tests.passed+c.reset+' passed, '+
                  c.cyan+summary.tests.skipped+c.reset+' skipped, '+
                  c.blue+summary.tests.total+c.reset+' total.');
        sys.puts("\n");
    };

    pub.failures = function(summary) {
        _.failures[cfg.type](summary);
    };
    _.failures = {};
    _.failures.console = function(summary) {
        var failedScaffoldingLength = summary.scaffolding.failObjs.length;
        if (failedScaffoldingLength > 0) {
            sys.print('failed scaffolding:');
        }
        for (var i = 0; i < failedScaffoldingLength; i++) {
            var o = summary.scaffolding.failObjs[i];
            pub.details(o.name, o.obj);
            pub.fail(o.type, o.obj);
        }

        var failedTestsLength = summary.tests.failObjs.length;
        if (failedTestsLength > 0) {
            sys.puts('failed tests:');
        }
        for (i = 0; i < failedTestsLength; i++) {
            var o = summary.tests.failObjs[i];
            pub.linebreak();
            pub.details('suite', o.obj.parent);
            pub.details(o.name, o.obj);
            pub.fail(o.obj, o.type);
        }
    };

    return pub;
}();