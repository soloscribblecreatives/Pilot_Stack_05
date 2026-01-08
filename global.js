/*Code by android developers start here*/
var startLoc = null;
//var contentName = '152';
//step 1:-
var contentName = parseInt(localStorage.getItem("currentbrand"));
var currentContentId  = parseInt(localStorage.getItem('currentcontent'));
//ends

checkClickThrough();

document.getElementById("main_content").addEventListener("touchmove", touchHandler, false);
document.getElementById("main_content").addEventListener("touchstart", touchHandler, false);
function touchHandler(e) {

	if (e.type == "touchstart") {

			 if( e.touches.length == 1 ) { // one finger touch
			 	var touch = e.touches[ 0 ];
			 	startLoc = { x : touch.pageX, y : touch.pageY };
			 }

			} else if (e.type == "touchmove") {
				if( startLoc ) {
					var touch = e.touches[ 0 ];

					if( Math.abs( startLoc.x - touch.pageX ) > Math.abs( startLoc.y - touch.pageY ) )
					{
						e.preventDefault();
					}
					startLoc = null;
				}

			}
		}
		/*Code by android developers ends here*/
		$(document).ready(function(){

			var ua = navigator.userAgent;
	//var event = "touchstart";
	var event = (ua.match(/Ipad/i)) ? "touchstart" : "click";


	$(".left_arrow").click(function(event) {
		go_nav('b');
	});

	$(".right_arrow").click(function(event) {
		go_nav('f');
	});

	$(".slides").click(function(){
		var slideNum =	$(this).index()+1;
		console.log(slideNum);
		open_page("",slideNum);

	});

	$(".reference").removeClass("active");

	$('.reference').on('swipeleft swiperight', function(event) {
		event.stopPropagation();
	});

	$(".box_btn").bind("click",function(){
		$(".reference").toggleClass("active");
	});

	currentSlide();

		$("#main_content").swipe({
	   swipeLeft:function(event, direction, distance, duration, fingerCount) {
		//alert("swipeleft");
		//myconsole("swipeleft");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var last_page_id = $(".slides").length;
		var slide_jumper_open = $(".reference").hasClass("active");
		if(page_id == last_page_id+1)	{
			return
		} else{
			go_nav('f');
		}
	  },

	  swipeRight:function(event, direction, distance, duration, fingerCount) {
			//alert("swiperight");
		//myconsole("swiperight");
		var page_id =  parseInt($("#wrapper").attr("rel"));
		var slide_jumper_open = $(".reference").hasClass("active");

		if(page_id == 0){
			//console.log("First Slide");
			//myconsole("First Slide");
			return
		} else {
			go_nav('b');
		}

	  } ,

        //Default is 75px, set to 0 for demo so any distance triggers swipe
         threshold:0
	});


});


function go_nav(direction) {
var page_id =  parseInt($("#wrapper").attr("rel"));
			
		
var flag=0;
if(direction == 'b') {


	if(page_id >= 0){
		page_id = page_id - 1;
		//alert(page_id);
		//console.log(page_id);
		if(page_id == 0){
            flag=2;
        }
	}
	 if(flag == 2){
        localStorage.setItem("gotoNextPrevBrand" ,2);//if one than next if 2 than prev
        //flag == 0;
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
	
		//window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
	}
	
}else {
	

	if(page_id <= 1){
		page_id = page_id + 1;
		//alert(page_id);
		if(page_id == 2){
            flag=1;
        }
	}
	    if(flag == 1){
        localStorage.setItem("gotoNextPrevBrand" ,1);//if one than next if 2 than prev
         flag == 0;
		 var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };


	window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
		 //window.location = "js-call:" + "1" + ":" + encodeURIComponent(JSON.stringify({query:'NODATA', type:'brandNavigation', callback:'checkLastPgFn'}));
    }else{
        localStorage.setItem("gotoNextPrevBrand" ,0);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe
  
    }


}



$("#wrapper").attr("rel",page_id);

var content="";
if(flag==0){
var pg_content = set_pg_content(page_id);

	$("#main_content").html(pg_content);
}
	//console.log("pg : "+page_id);
	if(page_id==4){
		/* $(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	}); */
		
	}
	 checkClickThrough();
}

function set_pg_content(pg_id){
$(".reference").removeClass("active");
currentSlide();
var selectedContentPath='';
switch(pg_id){
	case 1:
	content='<link rel="stylesheet" type="text/css" href="slide1/slide1.css" media="screen"/><div class="button1" onclick="playVid1()"></div><div class="video1"><video autoplay onstart="myFunction1()" id="startVideo" width="1080" height="810" source src="slide1/v1.mp4" type="video/mp4"></video></div><div class="video2"><video onended="myFunction2()" id="endVideo" width="1080" height="810" source src="slide1/v2.mp4" type="video/mp4"></video></div><audio id="loseAudio" source src="slide1/a1.mp3" type="audio/mpeg"></audio><audio id="winAudio" source src="slide1/a2.mp3" type="audio/mpeg"></audio><div class="q1"><img src="slide1/q1.png"/></div><div class="o1"><img src="slide1/o1.png"/></div><div class="p1"><img src="slide1/p1.png"/></div><div class="o2"><img src="slide1/o2.png"/></div><div class="p2"><img src="slide1/p2.png"/></div><div class="o3"><img src="slide1/o3.png"/></div><div class="p3"><img src="slide1/p3.png"/></div><div class="o4"><img src="slide1/o4.png"/></div><div class="p4"><img src="slide1/p4.png"/></div><div class="op1" onclick="op1()"></div><div class="op2" onclick="op2()"></div><div class="op3" onclick="op3()"></div><div class="op4" onclick="op4()"></div><div class="counter"><div id="time" class="time">30</div></div>';
	break;

}

return content;

}

function showDiv() {
   document.getElementById('welcomeDiv').style.display = "block";
}
function showDiv2() {
   document.getElementById('welcomeDiv2').style.display = "block";
}

function open_page(url,page_id){
	 //alert("===openpage====");
	localStorage.getItem('currentbrand');
    localStorage.getItem('currentcontent');
    localStorage.getItem('currentcontentbrandId');
    localStorage.getItem('current');
	localStorage.setItem("gotoNextPrevBrand" ,0);
	//alert("====currentbrand======"+localStorage.getItem('currentbrand'));
	//alert("====currentcontent======"+localStorage.getItem('currentcontent'));
	//alert("====currentcontentbrandId======"+localStorage.getItem('currentcontentbrandId'));
	//alert("====current======"+localStorage.getItem('current'));
	//alert("====previousslide======"+localStorage.getItem("previousslide"));
	//alert("====page_id======"+page_id);
		var objectData={

         "gotoNextPrevBrand": localStorage.getItem("gotoNextPrevBrand"),
          "previousslide": localStorage.getItem("previousslide"),
         "slideId": page_id
         };
  var params = {
  "query" : objectData,
  "type" : "brandNavigation",
  "callback" : "checkLastPgFn"
  };

	window.messageHandler.postMessage(JSON.stringify(params)); //pageswipe

	 $("#wrapper").attr("rel",page_id);
	 var content="";
	 var pg_content = set_pg_content(page_id);

	 	$("#main_content").html(pg_content);

	 if(page_id==4){
		$(".box2").click(function(event) {
			open_page("",5)
		});
		$(".box3").click(function(event) {
			open_page("",6)
		});
		$(".box4").click(function(event) {
	 		open_page("",7)
	 	});
		$(".box5").click(function(event) {
	 		open_page("",8)
	 	});
		$(".box6").click(function(event) {
	 		open_page("",9)
	 	});
		$(".box7").click(function(event) {
	 		open_page("",10)
	 	});
		$(".box8").click(function(event) {
	 		open_page("",11)
	 	});
	 }
	  checkClickThrough();
	}

	function checkClickThrough(){
	var currentslide=localStorage.getItem("currentslide");
	//alert(currentslide);
	document.getElementById("click_through").innerHTML='';

	if(currentslide == 1){
	document.getElementById("click_through").innerHTML='';
		}
    if(currentslide == 2){
	document.getElementById("click_through").innerHTML='';
		}
	}

	function checkBtns(refNum){
		switch(refNum){
			case 1:
			open_page('',1);
            break;
		}
	}

	function currentSlide(){
		var curr_id =  parseInt($("#wrapper").attr("rel"));
		$(".slides").removeClass("active");
		$(".slides:nth-child("+curr_id+")").addClass("active");
	}

	var ln = 0;
	function myconsole(msg){

		var oldMsg = "</br>"+ln+". "+$("#myconsole").html();
		ln++
		$("#myconsole").html(msg+oldMsg);
	}

function currentTimeInDatabaseFormat(){//to get current time in dd-mm-yyyy hh:mm:ss
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
		month = parseInt(month)+1;
	if(month.toString().length==1){
		month="0"+month;
	}

	var date = new Date().getDate();
	if(date.toString().length==1){
		date="0"+date;
	}

	var hour = new Date().getHours();
	if(hour.toString().length==1){
		hour="0"+hour;
	}

	var minutes = new Date().getMinutes();
	if(minutes.toString().length==1){
		minutes="0"+minutes;
	}

	var seconds = new Date().getSeconds();
	if(seconds.toString().length==1){
		seconds="0"+seconds;
	}

	var duration= year+"-"+month+"-"+date+"-"+hour + ":" + minutes + ":" + seconds;
	return duration;
}

// new js

$(document).ready(function(){
	$('body').on('click','.touchbtn',function(){
		$('.right_arrow').trigger( "click" );
	})

	$(document).on('click','.btnshow',function(){
//alert('hi')
		$('.touchbtn').css("display","block");
	})
})

/*--------------------------Javascript Animation-----------------------------*/

function playVid1() {
	document.getElementById("startVideo").play();
	$('.button1').css("display","none");
}

function myFunction1() {
	setTimeout(function() {
		timer();
		document.getElementById("tickAudio").play();
		$('.q1').css("display","block");
		$('.o1').css("display","block");
		$('.o2').css("display","block");
		$('.o3').css("display","block");
		$('.o4').css("display","block");
		$('.time').css("display","block");
		setTimeout(function() {
			$('.op1').css("display","block");
			$('.op2').css("display","block");
			$('.op3').css("display","block");
			$('.op4').css("display","block");
		}, 1000);	
	}, 10000);
};

function op1() {
	const a = document.getElementById("tickAudio"); a.pause(); a.currentTime = 0;
	document.getElementById("loseAudio").play();
	   $('.p1').css("display","block");
	   $(".p1").addClass("selected");
	   $('.op1').css("display","none");
	   $('.op2').css("display","none");
	   $('.op3').css("display","none");
	   $('.op4').css("display","none");
	setTimeout(function() {
	   $('.p4').css("display","block");
	}, 1000);
	setTimeout(function() {
	   $('.q1').css("display","none");
	   $('.o1').css("display","none");
	   $('.p1').css("display","none");
	   $('.o2').css("display","none");
	   $('.p2').css("display","none");
	   $('.o3').css("display","none");
	   $('.p3').css("display","none");
	   $('.o4').css("display","none");
	   $('.p4').css("display","none");
	   $(".video1").css("display","none");
	   const a = document.getElementById("startVideo"); a.pause(); a.currentTime = 0;
	   $(".video2").css("display","block");
	   document.getElementById("endVideo").play();
	}, 4000);
}

function op2() {
	const a = document.getElementById("tickAudio"); a.pause(); a.currentTime = 0;
	document.getElementById("loseAudio").play();
	   $('.p2').css("display","block");
	   $(".p2").addClass("selected");
	   $('.op1').css("display","none");
	   $('.op2').css("display","none");
	   $('.op3').css("display","none");
	   $('.op4').css("display","none");
	setTimeout(function() {
	   $('.p4').css("display","block");
	}, 1000);
	setTimeout(function() {
	   $('.q1').css("display","none");
	   $('.o1').css("display","none");
	   $('.p1').css("display","none");
	   $('.o2').css("display","none");
	   $('.p2').css("display","none");
	   $('.o3').css("display","none");
	   $('.p3').css("display","none");
	   $('.o4').css("display","none");
	   $('.p4').css("display","none");
	   $(".video1").css("display","none");
	   const a = document.getElementById("startVideo"); a.pause(); a.currentTime = 0;
	   $(".video2").css("display","block");
	   document.getElementById("endVideo").play();
	}, 4000);
}

function op3() {
	const a = document.getElementById("tickAudio"); a.pause(); a.currentTime = 0;
	document.getElementById("loseAudio").play();
	   $('.p3').css("display","block");
	   $(".p3").addClass("selected");
	   $('.op1').css("display","none");
	   $('.op2').css("display","none");
	   $('.op3').css("display","none");
	   $('.op4').css("display","none");
	setTimeout(function() {
	   $('.p4').css("display","block");
	}, 1000);
	setTimeout(function() {
	   $('.q1').css("display","none");
	   $('.o1').css("display","none");
	   $('.p1').css("display","none");
	   $('.o2').css("display","none");
	   $('.p2').css("display","none");
	   $('.o3').css("display","none");
	   $('.p3').css("display","none");
	   $('.o4').css("display","none");
	   $('.p4').css("display","none");
	   $(".video1").css("display","none");
	   const a = document.getElementById("startVideo"); a.pause(); a.currentTime = 0;
	   $(".video2").css("display","block");
	   document.getElementById("endVideo").play();
	}, 4000);
}

function op4() {
	const a = document.getElementById("tickAudio"); a.pause(); a.currentTime = 0;
	document.getElementById("winAudio").play();
	   $('.p4').css("display","block");
	   $(".p4").addClass("selected");
	   $('.op1').css("display","none");
	   $('.op2').css("display","none");
	   $('.op3').css("display","none");
	   $('.op4').css("display","none");
	setTimeout(function() {
	   $('.q1').css("display","none");
	   $('.o1').css("display","none");
	   $('.p1').css("display","none");
	   $('.o2').css("display","none");
	   $('.p2').css("display","none");
	   $('.o3').css("display","none");
	   $('.p3').css("display","none");
	   $('.o4').css("display","none");
	   $('.p4').css("display","none");
	   $(".video1").css("display","none");
	   const a = document.getElementById("startVideo"); a.pause(); a.currentTime = 0;
	   $(".video2").css("display","block");
	   document.getElementById("endVideo").play();
	}, 3000);
}

function timer() {
	let counter = 30;
	function formatNumber(num) {
		return num < 10 ? "0" + num : num;
	}
	// Display initial time
	$("#time").text(formatNumber(counter));
	const timer = setInterval(function() {
       counter--;
       $("#time").text(formatNumber(counter));
		if (counter <= 0) {
			clearInterval(timer);
			setTimeout(function() {
				  op4();
			}, 1500);
		}
		else if ($(".p1").hasClass("selected") || $(".p2").hasClass("selected") || $(".p3").hasClass("selected") || $(".p4").hasClass("selected")){
			clearInterval(timer);
		}
	}, 1000);
}