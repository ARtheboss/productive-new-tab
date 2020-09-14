
var tm;

$(document).ready(function() {


	tm = new ToolManager('options', false);

	$(document).on('click', '.sidemenu',function(){
		//$(".nav-item").removeClass('active');
		//$(this).addClass('active');
		tm.showTool($(this).attr('id').substring(2));
		if($(this).attr('id') == 'n-general')
			$('#m-general').show();
		else
			$('#m-general').hide();
	});

	$('#name').val(localStorage.getItem('name'));

	$('#name').on('change', function(){
		localStorage.setItem('name', $(this).val());
		$('.welcome').html("Welcome, "+localStorage.getItem('name'));
	});

	$('#p-color').val(colors[0]);
	$('#s-color').val(colors[1]);
	$('#t-color').val(colors[2]);

	$('#p-color').on('change', function(){
		colors[0] = $('#p-color').val();
		saveColors(true);
	});
	$('#s-color').on('change', function(){
		colors[1] = $('#s-color').val();
		saveColors(true);
	});
	$('#t-color').on('change', function(){
		colors[2] = $('#t-color').val();
		saveColors(true);
	});

	$("#tools").sortable({
		update: function(event){
			var tools = [];
			var using = true;
			$("#tools").children('li').each(function(i){
				if($("li:nth-of-type("+i+") > h4").html() == "Not using"){
					using = false;
				}else if(using && $("li:nth-of-type("+i+") > h4").html() != null){
					tools.push($("li:nth-of-type("+i+") > h4").html());
				}
			});
			tm.tools = tools;
			tm.saveData();
		}
	});

	var tool_names = [];

	for(var i = 0; i < tm.tools.length; i++){
		$("#tools").append("<li><h4>"+tm.tools[i]+"</h4><p>"+tool_dict[tm.tools[i]].description+"</p></li>");
		tool_names.push(tm.tools[i].tool);
	}

	$("#tools").append("<li class='divider'>Not using</li>");

	for(var key in tool_dict){
		if(tool_names.indexOf(key) == -1){
			$("#tools").append("<li><h4>"+key+"</h4><p>"+tool_dict[key].description+"</p></li>");
		}
	}

});