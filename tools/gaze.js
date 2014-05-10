// @config
var _config = {
    rootdir: 'c:/production'
};

var Gaze = require('gaze'),

    async = require("async"),
    exec = require('child_process').exec;





function add1(n, callback) {
    setTimeout(function() {
        callback(null, n + 1);
    }, 10);
}

function mul3(n, callback) {
    setTimeout(function() {
        callback(null, n * 3);
    }, 10);
}

var add1mul3 = async.compose(mul3, add1);

add1mul3(4, function(err, result) {
    // result now equals 15
});





// Watch all .js files/dirs in process.cwd()
var GazeGitHubPush = new Gaze(_config.rootdir + '/**/*.js', function(err, watcher) {
    // Files have all started watching
    // watcher === this
    // On changed/added/deleted
    // On file changed

    this.on('changed', function(filepath) {
        console.log(filepath + ' was changed');
        this.pushGH(filepath);
    });

    // On file added
    this.on('added', function(filepath) {
        console.log(filepath + ' was added');
    });

    // On file deleted
    this.on('deleted', function(filepath) {
        console.log(filepath + ' was deleted');
    });
});


GazeGitHubPush.prototype.pushGH = function(event, filepath) {
    console.log('Seeing ' + event + ' on ' + filepath);
    exec("cd " + _config.rootdir + "  &&  git commit -am 'auto push'", function(res, stdout, stderr) {
        this.logit('...commiting', res, stdout, stderr);
        exec("git push", function(res, stdout, stderr) {
            stdout ? console.log('...on it stdout: ' + stdout) : '';
            stderr ? console.log('...on it stderr: ' + stderr) : '';
        });
    });
};


GazeGitHubPush.prototype.logit = function(res, stdout, stderr) {
    stdout ? console.log('...on it stdout: ' + stdout) : '';
    stderr ? console.log('...on it stderr: ' + stderr) : '';
};

/*    
    this.on('all', function(event, filepath) {
        console.log(filepath + ' was ' + event);
        var exec = require('child_process').exec;
    });
    
    // On file changed
    this.on('changed', function(filepath) {
        console.log(filepath + ' was changed');

   });

    // On file added
    this.on('added', function(filepath) {
        console.log(filepath + ' was added');
    });

    // On file deleted
    this.on('deleted', function(filepath) {
        console.log(filepath + ' was deleted');
    });

    // Get all watched files
    this.watched(function(err, watched) {
        console.log(watched);
    });    
   
   // Get watched files with relative paths
    this.relative(function(err, files) {
        console.log(files);
    });
    
  */