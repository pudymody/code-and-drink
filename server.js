var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 1337 }),

	linter = require("eslint").linter,
	vm = require('vm');

var FINISHED = false;
var initialCtx = {};
function check( ctx ){
	return ctx.result == 9;
}

var Score = {};
var socketHandlers = {
	join : function( token ){
		Score[ this.token ] = 0;
		Object.defineProperty(this, 'token', {
			configurable : false,
			value : token,
			writable : false
		});
	},

	submit : function( file ){
		var lintResult = linter.verify(file, {
			rules: {
				semi: 2
			},
			enviroment: "node"
		})
			.filter(function( item ){
				return item.hasOwnProperty('fatal') && item.fatal;
			});

		if( lintResult.length ){
			Score[ this.token ]++;
			this.send('');
			console.log( this.token + " has to drink " + lintResult.length + " times");
			return;
		}

		var userCtx = JSON.parse(JSON.stringify(initialCtx));
		vm.runInNewContext( file, userCtx );
		if( check(userCtx) ){
			console.log( this.token + " has won, everyone has to drink" );
			FINISHED = true;
		}else{
			Score[ this.token ]++;
			this.send('');
			console.log( this.token + " has to drink because he gets the wrong result");
			return;
		}
	}
};

wss.on('connection', function(ws){
	ws.on('message', function(message){
		if( FINISHED ){
			return;
		}
		var msg = JSON.parse(message);
		msg.data = [].concat(msg.data);

		if( socketHandlers.hasOwnProperty( msg.action ) ){
			socketHandlers[ msg.action ].apply(this, msg.data);
		}
	});
});
