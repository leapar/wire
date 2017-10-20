
var Player = null;
//对应的摄像头IP
var IP = "";


function init() {
	$("video").hide();
	Player.currentTime(0);
	Player.pause();
}

$(function() {
	IP = G_SET_GY[$("video").attr("data-index")-1];
	Player = videojs("video", { "controls": false, "autoplay": false, "preload": "auto" });
	Player.src($("video").attr("data-src"));
	init();
	Player.on("ended" ,function() {
		console.log("ended");
		init();
	});
});

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

	if(!Player.paused())
		return;
	$("video").show();
	Player.currentTime(0);
	Player.play();

}