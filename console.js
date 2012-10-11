(function(undefined) {
	//'use strict';
    //var files = ['./test/always-suite.js'];

    var walk    = require('walk');
    var files   = [];

    // Walker options
    var walker  = walk.walk('./test', { followLinks: false });

    walker.on('file', function(root, stat, next) {
        if (stat.name.match(/\-suite\.js$/g)) {
            // Add this file to the list of files
            files.push(root + '/' + stat.name);
        }
        next();
    });

    walker.on('end', function() {
        console.log(files);

        var sys = require('sys');
        var always = require('./lib/always.js');

        var len_files = files.length;
        for (var i = 0; i < len_files; i++) {
            var s = require(files[0]);
            var suites = [];

            if (typeof s.name !== 'undefined') {
                suites.push(s);
            } else {
                suites = s;
            }

            var num_suites = suites.length;
            for (var n = 0; n < num_suites; n++) {
                //sys.print('...'+ (n+1));
                if (! always.loadSuite(suites[n]) ) {
                    console.error("\n"+'unable to load file: ' + files[i]);
                    console.error(always.getErrorMessage());
                }
            }
        }
        always.begin();

    });

})();