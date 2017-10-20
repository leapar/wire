
var Player = null;

var G_STATUS = 0;//0 初始化 1 正在播放葡萄藤  2正在播放介绍片
var G_STEP = 0;
var Timer = null;

function clearTimer() {
	if(Timer != null) {
		clearTimeout(Timer);
		Timer = null;
	}
}

function setTimer()
{
	if(Timer != null) {
		clearTimeout(Timer);
		Timer = null;
	}
	Timer = setTimeout("init()",1000*60*2)
}


function init() {
	unregisterVLCEvent("MediaPlayerTimeChanged", handle_MediaPlayerTimeChanged);
	unregisterVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
	unregisterVLCEvent("MediaPlayerMediaChanged", handle_MediaPlayerMediaChanged);
	//Player.currentTime(0);
	Player.input.time = 0;
	Player.playlist.pause();
	$("#video").hide();
	
	G_STATUS = 0;
	G_STEP = 0;
	
	G_MAP_PTT.forEach(function(value, key, map) {
		console.log("Key: %s, Value: %s", key, value);
		value.flag = 0;
	});
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
	init();
	
	/*Player = videojs("video", { "controls": false, "autoplay": false, "preload": "auto" });
	
	init();
	Player.on("ended" ,function() {
		console.log("ended");
		if(G_STATUS == 1) {
			G_STATUS = 2;
			Player.src("/videos/1.mp4");
			Player.currentTime(0);
			Player.play();
		} else if(G_STATUS == 2) {
			init();
		} else {
			//nothing 
		}
	});

	Player.on("timeupdate" ,function() {
		if(G_STATUS != 1)
			return;
		var keys = [...G_MAP_PTT.keys()];
		var tmp = G_MAP_PTT.get(keys[G_STEP-1]);console.log(tmp );
		if(Player.currentTime() > tmp.time2) {
			Player.pause();
		}
		
	})*/;
});

function handle_MediaPlayerTimeChanged(time){
    console.log("Time changed: " + time + " ms");
    if(G_STATUS != 1)
		return;
	var keys = [...G_MAP_PTT.keys()];
	var tmp = G_MAP_PTT.get(keys[G_STEP-1]);console.log(tmp );
	if(time/1000 > tmp.time2) {
		Player.playlist.pause();
	}
}

function handle_MediaPlayerMediaChanged(){
    console.log("Media changed");
    if(G_STATUS == 1) {
            clearTimer();
            G_STATUS = 2;
	} 
}

function handle_MediaPlayerEndReached(){
    console.log("EndReached");
    if(G_STATUS == 1) {
	/*	G_STATUS = 2; //到不了 这里 
		Player.playlist.next()
		//Player.src("/videos/1.mp4");
		Player.input.time = 0;
		Player.playlist.play();*/
	} else if(G_STATUS == 2) {
		init();
	} else {
		//nothing 
	}
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
	
	if(!G_MAP_PTT.has(message.ip)) {
		return;
	}
	var ipinfo = G_MAP_PTT.get(message.ip);
	if(ipinfo.flag == 1) {
		return;
	}

	var keys = [...G_MAP_PTT.keys()];
	var index = keys.indexOf(message.ip);
	if(index > 0) {
		var tmp = G_MAP_PTT.get(keys[index-1]);
		if(tmp.flag != 1) {
			return;
		}
	}
	ipinfo.flag = 1;
	G_STEP++;

	if(G_STATUS == 0) {
		$("#video").show();
		Player.playlist.clear();
		Player.video.aspectRatio  = "16:9";
		Player.playlist.add("/videos/3.mp4");
		Player.playlist.add("/videos/1.mp4");
		
		G_STATUS = 1;
		
		Player.input.time = ipinfo.time * 1000;
		Player.playlist.play();
		registerVLCEvent("MediaPlayerTimeChanged", handle_MediaPlayerTimeChanged);
		registerVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
		registerVLCEvent("MediaPlayerMediaChanged", handle_MediaPlayerMediaChanged);
		setTimer();
	} else if(G_STATUS == 1) {
		Player.input.time = ipinfo.time * 1000;
		setTimer();
		if(Player.playlist.isPlaying)
			return;
		Player.playlist.togglePause();
		
	} else {
		//nothing 
	}
}