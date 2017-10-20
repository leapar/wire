
function sendMsg(ip,code) {
	$.get("http://127.0.0.1:3000/event",{ip:ip,code:code},function(result){
		console.log(result);
	});
}

function onMsg(message) {
	if(debug) {
		console.log(message);
	}
}

function onInit() {
	sendMsg("127.0.0.1",-1);
}

function onDqx(index) {
	var keys = [...G_MAP_DQX.keys()];
	sendMsg(keys[index-1],0x4000);
}

function onGY(index) {
	sendMsg(G_SET_GY[index-1],0x4000);
}

function onPtt(index) {
	var keys = [...G_MAP_PTT.keys()];
	sendMsg(keys[index-1],0x4000);
}