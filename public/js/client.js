//Encapsulate our JS
(function(){
	//set up our variables
	var socket = io();
	var likeButtonElem = document.getElementById('_likebtn');
	var likeNumberElem = document.getElementById('_likenumber');
	var likeHeart = document.getElementById('_heart');
	var likeCount;

	//listen events from the server
	socket.on('initLikeCount', function (data) {
		likeCount = data.likeCount;
		//update our like count
		likeNumberElem.innerHTML = data.likeCount;
	});

	socket.on('updateLikeCount', function(data){
		//update our like count
		likeNumberElem.innerHTML = data.likeCount;

		//fire our like animation
		$(likeHeart).fadeIn(function(){
			$(this).fadeOut();
		});
	});

	//event for the like clikc
	likeButtonElem.addEventListener('click', function(event){
		//tell our socket.io server we liked it
		socket.emit('like', function(){});
	});

//pass in the objects we need
}(io, $));