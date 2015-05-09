/**
* Set up express with socket.io server
*/
var express = require('express')
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

//set out port and other config, jade, etc...
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'))

/**
* Set up node-localstorage, because its late and I don't want to 
* implement actual persistent storage...
*/
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//initalise our likes to zero
localStorage.setItem('likes', 0);

/**
* Routes
*/
app.get('/', function (req, res) {
  res.render('index',{})
})

//listen for connection event
io.on('connection', function(socket){
	//listen for like event
	socket.on('like', function(){
		//update our 'persitent' store for likes
		var currentLikes = parseInt(localStorage.getItem('likes'));
		currentLikes = currentLikes + 1;
		localStorage.setItem('likes', currentLikes);

		/** 
		* We emit on the io object to send events to all connected clients,
		* not just ones on the connected namespace
		*/
		//tell the clients to update their like count!
		io.emit('updateLikeCount', {
			likeCount: localStorage.getItem('likes')
		});
	});

	//tell the clients how many likes there are
	socket.emit('initLikeCount', {
		likeCount: localStorage.getItem('likes')
	});
});


