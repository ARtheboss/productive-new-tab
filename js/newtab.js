

var tm;

var active_day = new Date();

$(document).ready(function () {

	/*
	$("#todo-m").show();
	*/

	$('#welcome').html("Welcome, "+localStorage.getItem('name'));

	$('#time').html(formatAMPM(new Date()));
	setInterval(function() {
		$('#time').html(formatAMPM(new Date()));
	}, 1000);

	tm = new ToolManager('tab');

	$(".nav-item").click(function(){
		$(".nav-item").removeClass('active');
		$(this).addClass('active');
		tm.showTool($(this).attr('id').substring(2));
	});

});

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