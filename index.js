var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];

server.listen(8080, function()
{
	console.log("Server is on...");
});

io.on('connection', function(socket)
{
	console.log("Player connected");
	socket.emit('socketID',{id:socket.id});//emit = 1 player
	socket.emit('getPlayers', players);
	socket.broadcast.emit('newPlayer', {id:socket.id});//los demas

    socket.on('playerMoved', function(data)
    {
        data.id = socket.id;
        socket.broadcast.emit('playerMoved', data);

        for(var i = 0; i < players.length; i++)
        {
            if(players[i].id == data.id)
            {
                players[i].x = data.x;
                players[i].y = data.y;
            }
        }
    });

	socket.on('disconnect', function()
	{
		console.log("Player offliine");
		socket.broadcast.emit('playerDisconnected', {id:socket.id});
		for(var i = 0; i<players.length; i++)
		{
            if(players[i].id == socket.id)
            {
                players.splice(i, 1);
            }
		}
		//console.log("Number of Players: " +players.length);
	});

	players.push(new player(socket.id, 0, 0));
});

function player(id, x, y)
{
    this.id = id;
    this.x = x;
    this.y = y;
}




