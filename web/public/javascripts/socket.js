(function ($) {
    socket = null,
    clientId = null,
    username = null,
    serverAddress = window.location.hostname + ':3000',//'http://127.0.0.1:3000',//window.location.protocol + "//"+  window.location.hostname + ':3000',//

     debug = true;


    $.fn.startChat = function (nickname) {
        username = nickname;
    	
        //alert(userid);
        connect();

    }
    
    function startChat(nickname) {
        username = nickname;
    	
        //alert(userid);
        connect();
    }

    //?愙暈?婍
    function connect() {
    	//http://socket.io/docs/client-api/
        socket = io(serverAddress,{
           /* 'force new connection': true,*/
	   /*transports : ['polling'],*/
            reconnection : true,
            reconnectionDelay : 2000,
            reconnectionAttempts : 9
        });

        bindSocketEvents();
    }


    //?掕帠審
    function bindSocketEvents() {
        socket.on('connect', function () {
            socket.emit('login', {username: username});
        });

        if(debug) {
	        socket.on('reconnect_failed', function (data) {
	            console.log("reconnect_failed" + data);
	        });
	        socket.on('error', function (data) {
	            console.log("error" + data);
	        });
	        socket.on('disconnect', function (data) {
	            console.log("disconnect" + data);
	        });
	        socket.on('reconnect', function (data) {
	            console.log("reconnect" + data);
	        });
	        socket.on('reconnect_attempt', function (data) {
	            console.log("reconnect_attempt" + data);
	        });
	
	        socket.on('reconnecting', function (data) {
	            console.log("reconnecting" + data);
	        });
	        socket.on('reconnect_error', function (data) {
	            console.log("reconnect_error" + data);
	        });
	        socket.on('reconnect_failed', function (data) {
	            console.log("reconnect_failed" + data);
	        });
        }

        socket.on('login_success', function (data) {
        	if(debug) {
        		console.log(data.username);
    	}
        });
        
        socket.on('logout', function (message) {
        	$('#nug_login').modal('show');
        });

        socket.on('message', onMsg);
    }
    
    jQuery(function() {
    	//if($("#userinfo").length > 0) {
    	//	userid = $("#userinfo").attr("data-id");
        //    username = $("#userinfo").attr("data-name");

            startChat(window.location.pathname+window.location.search);
    	//}
    });


})(jQuery);