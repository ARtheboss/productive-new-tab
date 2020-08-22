


var todos = [];

var active_day = new Date();

$(document).ready(function () {

	$('#welcome').html("Welcome, "+localStorage.getItem('name'));

	$('#time').html(formatAMPM(new Date()));
	setInterval(function() {
		$('#time').html(formatAMPM(new Date()));
	}, 1000);

	try{
		todos = JSON.parse(localStorage.getItem('todo'));
	}catch(err){
		todos = null;
	}
	if(todos != null){
		for(var i = 0; i < todos.length; i++){
			$("#todo-select").append("<option value='"+i+"'>"+todos[i].name+"</option>");
		}
	}else{
		todos = [{'name':'Important', 'type': 0, 'list': []}];
		localStorage.setItem('todo', JSON.stringify(todos));
		for(var i = 0; i < todos.length; i++){
			$("#todo-select").append("<option value='"+i+"'>"+todos[i].name+"</option>");
		}
	}
	populateTodo(0);
});

function addBlankRow(){
	$("#todo-list").append("<tr class='blank'><td><label class='check-cont'><input type='checkbox'><span class='checkmark'></span></label></td><td><textarea></textarea></td><td><i class='fa fa-ellipsis-v more-info'></i></td></tr>");
}

function getDateString(d){
	var date = new Date(d);
	return datestring = date.getMonth() + "-" + date.getDate();
}

function populateTodo(n){
	var mylist = todos[n].list;
	if(todos[n].type){
		$(".heading").hide();
	}else{
		$(".heading").show();
	}
	$("#todo-list").html("");
	if(mylist.length != 0){
		$("#todo-list").html();
		for(var i = 0; i < mylist.length; i++){
			if((new Date() - new Date(mylist[i].date))/(1000 * 3600 * 24) > 5) mylist[i].done = true;
			if(mylist[i].done){
				todos[n].list.splice(i, 1);
				i--;
				continue;
			}else{
				var html = "<tr id='"+i+"' class='"+getDateString(mylist[i].date)+"'><td><label class='check-cont'><input type='checkbox'><span class='checkmark'></span></label></td>";
				html += "<td><textarea>"+mylist[i].task+"</textarea></td><td><i class='fa fa-ellipsis-v more-info'></i></td></tr>";
				$("#todo-list").append(html);
			}
		}
	}
	addBlankRow();
	for(var i = 0; i < mylist.length; i++){
		$("#"+i).find('textarea').eq(0).css('height' , getTextAreaHeight(mylist[i].task));
	}
	if(!todos[n].type) setHeadingDate(active_day);
}

function setHeadingDate(d){
	var date = getDateString(active_day);
	$("tr").hide();
	$("."+date).show();
	$(".blank").show();
	var options = { weekday: 'long', month: 'long', day: 'numeric' };
	var date = new Date(d);
	$('#active-date').html(date.toLocaleDateString("en-US", options));
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.subtractDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

$("#todo-list").on('keypress', 'textarea',function(e) {
    if(e.which == 13) {
    	e.preventDefault();
    	addBlankRow();
    	$(this).parent().parent().next().find('textarea').eq(0).focus();
    }
});

$(document).mouseup(function(e) {
    if (!$("#todo-popup").is(e.target) && $("#todo-popup").has(e.target).length === 0) {
        $("#todo-popup").hide();
    }
});

$("#todo-list").on('click', '.more-info', function(){
	var pos = $(this).offset();
	$("#todo-popup").show();
	$("#todo-popup").css({top: pos.top + 20, left: pos.left + 10});
});

function getTextAreaHeight(val){
	var width = $('.blank').find('textarea').eq(0).width()/8.2;
	return Math.max(1, Math.ceil(val.length / width)) * 27 + 3 +"px";
}

$("#todo-list").on('keyup', 'textarea', function() {
	$(this).css("height",getTextAreaHeight($(this).val()));
	var id = $(this).parent().parent().attr('id');
	var tasks = todos[$("#todo-select").val()].list;
	if(id != undefined){
		tasks[id].task = $(this).val();
	}else if($(this).val() != ""){
		tasks.push({'task':$(this).val(), 'date': active_day, 'done': false});
		$(this).parent().parent().attr('id', tasks.length-1);
		$(this).parent().parent().removeClass('blank');
		$(this).parent().parent().addClass(getDateString(tasks[tasks.length-1].date));
		addBlankRow();
	}
});

$("#todo-list").on('change', 'textarea', function() {
	localStorage.setItem('todo', JSON.stringify(todos));
});

$("#todo-list").on('change', 'input[type="checkbox"]', function() {
	var id = $(this).parent().parent().parent().attr('id');
	todos[$("#todo-select").val()].list[id].done = $(this).is(":checked");
	localStorage.setItem('todo', JSON.stringify(todos));
});

$("#todo-select").on('change', function(){
	populateTodo($("#todo-select").val());
});

$("#left-arrow").click(function() {
	if((new Date() - new Date(active_day))/(1000 * 3600 * 24) < 5) active_day = active_day.subtractDays(1);
	setHeadingDate(active_day);
});

$("#right-arrow").click(function() {
	active_day = active_day.addDays(1);
	setHeadingDate(active_day);
});



$(".nav-item").click(function(){
	$(".nav-item").removeClass('active');
	$(this).addClass('active');
	$(".menu").hide();
	var menu = $(this).attr('id').substring(0, $(this).attr('id').length - 2);
	$("#"+menu+"-m").show();
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