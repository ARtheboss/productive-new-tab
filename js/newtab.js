

var tm;

var active_day = new Date();

var images;

var time_since_click = 0;

var count_time = true;

$(document).ready(async function () {

	/*
	$("#todo-m").show();
	*/

	$('#welcome').html("Welcome, "+localStorage.getItem('name'));

	$('#time').html(formatAMPM(new Date()));
	setInterval(function() {
		$('#time').html(formatAMPM(new Date()));
		if(count_time) time_since_click += 0.1;
		if(time_since_click > 10){
			$('.menu').css('opacity',0.6);
		}else{
			$('.menu').css('opacity',1);
		}
	}, 100);

	tm = new ToolManager('tab');
	await tm.init();

	images = new ImageLoader();

	$(".nav-item").click(function(){
		$(".nav-item").removeClass('active');
		$(this).addClass('active');
		tm.showTool($(this).attr('id').substring(2));
	});

	//$('body').css('background','url("https://www.mepixels.com/cache/61e52391/4k-ultra-hd-desktop-wallpaper-1140x1140-ya2Qw1kIC.jpeg")')

});

$('body').on('click', function(){
	time_since_click = 0;
});
$('body').on('mouseenter', '.menu', function(){
	count_time = false;
	time_since_click = 0;
})
$('body').on('mouseleave', '.menu', function(){
	count_time = true;
})
$('body').on('keyup', '.menu', function(){
	time_since_click = 0;
})

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}