
var Player = null;
//对应的摄像头IP
var IP = "";


function init() {
	unregisterVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
	//Player.currentTime(0);
	Player.input.time = 0;
	Player.playlist.pause();
	$("#video").hide();
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
	IP = G_SET_GY[$("#video").attr("data-index")-1];
	
	Player = document.getElementById("video");
	
	//Player = videojs("video", { "controls": false, "autoplay": false, "preload": "auto" });
	//Player.src($("#video").attr("data-src"));
	init();
	/*Player.on("ended" ,function() {
		console.log("ended");
		init();
	});*/
});

function handle_MediaPlayerEndReached(){
    console.log("EndReached");
    	init();
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
	
	if(message.ip != IP) {
		return;
	}

	if(Player.playlist && !Player.playlist.isPlaying)
		return;
	$("#video").show();
	Player.playlist.clear();
	//Player.video.aspectRatio  = "16:9";
	Player.playlist.add($("#video").attr("data-src"));
	Player.input.time = 0;
	Player.playlist.play();
      registerVLCEvent("MediaPlayerEndReached", handle_MediaPlayerEndReached);
}