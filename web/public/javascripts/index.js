
var Player = null;



//无限循环播放
$(function() {
	var vlc = document.getElementById("vlc");
	//vlc.audio.toggleMute();
	//vlc.video.aspectRatio  = "16:9";//"1:1", "4:3", "16:9", "16:10", "221:100" and "5:4"
	vlc.playlist.add("/videos/5.mp4");
	//vlc.video.fullscreen = true;
	vlc.playlist.play();
	
	/*
	Player = videojs("video", { "controls": false, "autoplay": true, "loop": false, "preload": "auto",aspectRatio :'16:9' });
	Player.src($("video").attr("data-src"));
	Player.on("ended",function() {
		Player.currentTime(0);
		Player.play();
	});
	
	Player.on("play",
	    function () {
	       // Player.requestFullScreen();
	});*/
/*
	player1.on("ended",
	    function () {
	        this.cancelFullScreen();
	});*/

});

function onMsg(message) {
	if(debug) {
		console.log(message);
	}
}