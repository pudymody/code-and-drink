	// Filesystem core module
var fs = require('fs'),

	// We require the library to watch files
	chokidar = require('chokidar'),

	// We get the arguments passed, we remove the two first, because they are the node command and this file path.
	argv = process.argv.slice(2),

	// Websocket client
	WebSocket = require('ws');

// Validate token
if( argv[1] === undefined ){
	console.error("The given token is invalid");
	return;
}

// Validate server ip
if( argv[2] === undefined ){
	console.error("The given ip is invalid");
	return;
}

// Start connection to websocket server
var ws = new WebSocket('ws://' + argv[2] + ':1337');

// We need to start everything when the connection is open
ws.on('open', function(){

	ws.send( JSON.stringify({action : 'join', data : argv[1] }) );
	ws.on('message', function(data){
		console.log('You have to drink');
	});


	// Check that the file can be read by the system
	fs.access( argv[0], fs.R_OK, function( err ){
		if( err ){
			console.error("Given file cant be read by the process or doesnt exists");
			return;
		}

		// Start watching file
		chokidar.watch( argv[0] )
			.on('error', function( err ){
				console.log("There was an error reading the file");
				console.error(err);
			})
			.on('change', function(file){
				fs.readFile( file, function( err, data ){
					if( err ){
						console.log("There was an error reading the file");
						console.error(err);
						return;
					}

					ws.send( JSON.stringify({action : 'submit', data : data.toString('utf8') }) );
				});
			});
	});

});
