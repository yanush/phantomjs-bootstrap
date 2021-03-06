var fs = require('fs');

var args = parseArguments(phantom.args);

if (!args['--main']) 
 	throw 'usage:\n phantomjs bootstrap.js \n--main=<main script to run> \n--require=<additional libs separated by;> \n--inject=<additional libs separated by;>';

var main = './' + args['--main'];

if (!fs.exists(main)) 
	throw 'cannot find ' + main;

if (args['--require'])
	loadLibraries(requireScript, args['--require']);

if (args['--inject'])	
	loadLibraries(injectScript, args['--inject']);

requireScript(main);

function loadLibraries(loadFunctor, data) {
			
	var libPath = data.split(';');

	for (var i = 0; i < libPath.length; i++) {
		var currentPath = fs.workingDirectory + fs.separator + libPath[i];

		if (!fs.exists(currentPath)) 
			throw 'cannot find ' + currentPath;

		if (fs.isDirectory(currentPath)) {
			var files = fs.list(currentPath);
			
			for (var x = 0; x < files.length; x++) {
			
				var filename = files[x];
				var extension = filename.substr(-3);

				if (typeof(extension) === 'string') {
					extension = extension.toLowerCase();

					if (extension === '.js')					
						loadFunctor('./' + libPath[i] + '/' + filename);
				}
			}

		} else {

			loadFunctor('./' +libPath[i]);
		}			
	}
}

function injectScript(path) {
	console.log('injecting ' + path);
	phantom.injectJs(path);
}

function requireScript(path) {
	console.log('requiring ' + path);	
	require(path);
}

function parseArguments(args) {
	var parsedArguments = {};

	for (var x = 0; x < args.length; x++) {
		var pair = args[x].split('=');

		if (pair.length === 1)
			parsedArguments[pair[0]] = '';
		else if (pair.length === 2)
			parsedArguments[pair[0]] = pair[1];
	}

	return parsedArguments;
}