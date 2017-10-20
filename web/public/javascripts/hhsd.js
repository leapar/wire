
var Player = null;

var G_STATUS = 0;//0 初始化 1 触发第一个点  2 触发第二个点

function init() {
	$("#video").hide();
	Player.input.time = 0;
	Player.playlist.pause();
	G_STATUS = 0;
	G_MAP_DQX.forEach(function(value, key, map) {
		console.log("Key: %s, Value: %s", key, value);
		value.flag = 0;
	});
	//unregisterVLCEvent
	unregisterVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
	unregisterVLCEvent("MediaPlayerStopped", handle_MediaPlayerStopped);
}

function registerVLCEvent(event, handler) {
    if (Player) {
        if (Player.attachEvent) {
            // Microsoft
            Player.attachEvent (event, handler);
        } else if (Player.addEventListener) {
            // Mozilla: DOM level 2
            Player.addEventListener (event, handler, false);
        }
    }
}
function unregisterVLCEvent(event, handler) {
    if (Player) {
        if (Player.detachEvent) {
            // Microsoft
            Player.detachEvent (event, handler);
        } else if (Player.removeEventListener) {
            // Mozilla: DOM level 2
            Player.removeEventListener (event, handler, false);
        }
    }
}

$(function() {
	Player = document.getElementById("video");
	

	//vlc.audio.toggleMute();
	//Player.video.aspectRatio  = "16:9";//"1:1", "4:3", "16:9", "16:10", "221:100" and "5:4"
	//Player.playlist.add("/videos/6.mp4");
	//vlc.video.fullscreen = true;
	init();
	/*
	Player.on("ended" ,function() {
		console.log("ended");
		init();
	});*/
	
	//Player.playlist.play();
	/*
	Player = videojs("video", { "controls": false, "autoplay": false, "preload": "auto" });
	Player.src($("#video").attr("data-src"));
	init();
	Player.on("ended" ,function() {
		console.log("ended");
		init();
	});*/
});

function handle_MediaPlayerEndReached(){
    console.log("EndReached");
    	init();
}
function handle_MediaPlayerStopped(){
    alert("Stopped");
}


function onMsg(message) {
	if(debug) {
		console.log(message);
	}
	//-1初始化
	if(message.code == -1) {
		init();
		return;
	}
	

	if(!G_MAP_DQX.has(message.ip)) {
		return;
	}

	var ipinfo = G_MAP_DQX.get(message.ip);
	if(ipinfo.flag == 1) {
		return;
	}
	var keys = [...G_MAP_DQX.keys()];
	var index = keys.indexOf(message.ip);
	if(index > 0) {
		var tmp = G_MAP_DQX.get(keys[index-1]);
		if(tmp.flag != 1) {
			return;
		}
	}
	ipinfo.flag = 1;

	if(index == G_MAP_DQX.size - 1) {
		$("#video").show();
		Player.video.marquee.enable();         
		registerVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
		registerVLCEvent("MediaPlayerStopped", handle_MediaPlayerStopped);
		
		
		Player.playlist.clear();
		Player.video.aspectRatio  = "16:9";
		Player.playlist.add("/videos/6.mp4");
		Player.input.time = 0;
		Player.playlist.play();
		
		
		
	
	}
}