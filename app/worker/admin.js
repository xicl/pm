/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
/*+------------------------------------------------------------------------
 * cluster 管理API
 *
 * @author : pengchun@taobao.com
 *+------------------------------------------------------------------------
 */

var Net		= require('net');
var Http	= require('http');

var admin	= require(__dirname + '/../../lib/cluster.js').create();

var server	= Http.createServer(function (req, res) {
	// XXX:
	//
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
	admin.release();
});

admin.ready(function (handle) {
	var socket = new Net.Socket({
		'handle'		: handle,
		'allowHalfOpen'	: server.allowHalfOpen, 
	}); 

	socket.readable	= true;
	socket.writable = true;
	socket.resume();
	socket.server	= server;

	server.connections++;
	server.emit('connection', socket);
	socket.emit('connect');
});
