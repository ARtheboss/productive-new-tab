
var activeMenu = "Todo";

var todos = [];

$(".body").on('click', '.sidemenu', function(){
	activeMenu = $(this).html();
	$('.menu').hide();
	$('.'+activeMenu).show();
});

$('#todo-table').on('click', '.delete-todo', function() {
	todos.splice($(this).parent().attr('id').substring(5), 1);
	localStorage.setItem('todo', JSON.stringify(todos));
	setTimeout(function(){renderTodo()},100);
});

$("#add-todo").click(function(){
	todos.push({'name':$('#todo-name').val(), 'type': parseInt($('#todo-type').val()), 'list': []});
	localStorage.setItem('todo', JSON.stringify(todos));
	renderTodo();
});

$(document).ready(function() {

	renderTodo();

});

function renderTodo(){
	$("#todo-table").html("<tr><th>Name</th><th>Type</th><th># Events</th><th>Delete</th></tr>");

	try{
		todos = JSON.parse(localStorage.getItem('todo'));
	}catch(err){
		todos = null;
	}
	if(todos == null){
		todos = [{'name':'Default', 'type': 0, 'list': []}];
		localStorage.setItem('todo', JSON.stringify(todos));
	}

	for(var l = 0; l < todos.length; l++){
		var html = "<tr id='todo-"+l+"'>";
		html += "<td>"+todos[l].name+"</td>";
		html += (!todos[l].type) ? "<td>Day-to-day</td>" : "<td>Long term</td>";
		html += "<td>"+todos[l].list.length+"</td>";
		html +=  "<td class='delete-todo'>Delete</td>";
		$("#todo-table").append(html);
	}
}