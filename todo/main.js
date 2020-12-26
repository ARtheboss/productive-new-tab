
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


class Todo extends Tool{

	constructor(loc){
		super(loc, 'todo');
		this.fa = 'list-ul'
		this.loc = loc;
		this.active_day = new Date();
		this.selected_item = 0;
	}



	tabOnclicks(){
		var self = this;

		$("#todo-list").on('keypress', 'textarea',function(e) {
		    if(e.which == 13) {
		    	e.preventDefault();
		    	$(this).parent().parent().next().find('textarea').eq(0).focus();
		    }
		});

		$(document).mouseup(function(e) {
		    if (!$("#todo-popup").is(e.target) && $("#todo-popup").has(e.target).length === 0) {
		        $("#todo-popup").hide();
		    }
		});

		$("#todo-list").on('click', '.more-info', function(){
			if(!$(this).parent().parent().hasClass('blank')){
				var pos = $(this).offset();
				self.selected_item = $(this).parent().parent().attr('id');
				$("#todo-popup").show();
				$("#todo-popup").css({top: pos.top + 20, left: pos.left + 10});
			}
		});

		$("#todo-popup").on('click', '.popup-item', function(){
			var index = $(this).index();
			if(index == 0)
				self.moveToNextDay();
			else if(index == 1)
				self.moveToLastDay();
			else if(index == 2)
				self.deleteDay();
		});

		$("#todo-list").on('keyup', 'textarea', function() {
			self.keyupChange(this);
		});

		$("#todo-list").on('change', 'textarea', function() {
			self.saveData();
		});

		$("#todo-list").on('change', 'input[type="checkbox"]', function() {
			var id = $(this).parent().parent().parent().attr('id');
			self.data[$("#todo-select").val()].list[id].done = $(this).is(":checked");
			self.saveData();
		});

		$("#todo-select").on('change', function(){
			self.populateTodoList($("#todo-select").val());
		});

		$("#prev-day-todo").click(function() {
			self.prevDay();
		});

		$("#next-day-todo").click(function() {
			self.nextDay();
		});

		$(window).on('resize', function() {
			self.populateTodoList($("#todo-select").val());
		});

	}

	async getData(){
		this.data = [];
		try{
			this.data = JSON.parse(localStorage.getItem('todo'));
		}catch(err){
			this.data = [{'name':'Important', 'type': 0, 'list': []}];
			this.saveData();
		}
		if(this.data == null){
			this.data = [{'name':'Important', 'type': 0, 'list': []}];
			this.saveData();
		}
	}

	populateData(){
		if(this.loc == 'tab'){
			this.populateTodoNames();
			this.populateTodoList(0);
		}else{
			this.populateOptionsTable();
		}
	}

	populateTodoNames(){
		this.getData();
		$("#todo-select").html("");
		for(var i = 0; i < this.data.length; i++){
			$("#todo-select").append("<option value='"+i+"'>"+this.data[i].name+"</option>");
		}
	}

	async populateTodoList(n){
		await this.getData();
		this.setHeadings(n);
		var mylist = this.data[n].list;
		$("#todo-list").html("");
		if(mylist.length != 0){
			for(var i = 0; i < mylist.length; i++){
				if(!this.data[n].type) this.checkExpiration(n, i);
				if(mylist[i].done){
					this.data[n].list.splice(i, 1);
					i--;
					continue;
				}else{
					var html = "<tr id='"+i+"' class='"+this.getDateString(mylist[i].date)+"'><td><label class='check-cont'><input type='checkbox'><span class='checkmark'></span></label></td>";
					html += "<td><textarea>"+mylist[i].task+"</textarea></td><td><i class='fa fa-ellipsis-v more-info'></i></td></tr>";
					$("#todo-list").append(html);
				}
			}
		}
		this.addBlankRow();
		for(var i = 0; i < mylist.length; i++){
			$("#"+i).find('textarea').eq(0).css('height' , this.getTextAreaHeight(mylist[i].task));
		}
		if(!this.data[n].type) this.setHeadingDate(this.active_day);
	}

	setHeadings(n){
		if(this.data[n].type){
			$(".heading").hide();
		}else{
			$(".heading").show();
		}
	}

	checkExpiration(n, i){
		if((new Date() - new Date(this.data[n].list[i].date))/(1000 * 3600 * 24) > 5) this.data[n].list[i].done = true;
	}

	addBlankRow(){
		$("#todo-list").append("<tr class='blank'><td><label class='check-cont'><input type='checkbox'><span class='checkmark'></span></label></td><td><textarea></textarea></td><td><i class='fa fa-ellipsis-v more-info'></i></td></tr>");
	}

	getDateString(d){
		var date = new Date(d);
		return date.getMonth() + "-" + date.getDate();
	}

	setHeadingDate(d){
		var date = this.getDateString(this.active_day);
		$("tr").hide();
		$("."+date).show();
		$(".blank").show();
		var options = { weekday: 'long', month: 'long', day: 'numeric' };
		var date = new Date(d);
		$('#active-date').html(date.toLocaleDateString("en-US", options));
	}

	getTextAreaHeight(val){
		var width = $('.blank').find('textarea').eq(0).width()/8.2;
		return Math.max(1, Math.ceil(val.length / width)) * 27 + 3 +"px";
	}

	keyupChange(obj){
		$(obj).css("height",this.getTextAreaHeight($(obj).val()));
		var id = $(obj).parent().parent().attr('id');
		var tasks = this.data[$("#todo-select").val()].list;
		if(id != undefined){
			tasks[id].task = $(obj).val();
		}else if($(obj).val() != ""){
			tasks.push({'task':$(obj).val(), 'date': this.active_day, 'done': false});
			$(obj).parent().parent().attr('id', tasks.length-1);
			$(obj).parent().parent().removeClass('blank');
			$(obj).parent().parent().addClass(this.getDateString(tasks[tasks.length-1].date));
			this.addBlankRow();
		}
	}

	prevDay(){
		if((new Date() - new Date(this.active_day))/(1000 * 3600 * 24) < 5) this.active_day = this.active_day.subtractDays(1);
		this.setHeadingDate(this.active_day);
	}

	nextDay(){
		this.active_day = this.active_day.addDays(1);
		this.setHeadingDate(this.active_day);
	}

	populateOptionsTable(){
		this.getData();
		$("#todo-table").html("<tr><th>Name</th><th>Type</th><th># Events</th><th>Delete</th></tr>");
		for(var l = 0; l < this.data.length; l++){
			var html = "<tr id='todo-"+l+"'>";
			html += "<td><input type='text' value='"+this.data[l].name+"'></td>";
			html += "<td><select>";
			html += (!this.data[l].type) ? "<option value='0' selected>Day-to-day</option>" : "<option value='0'>Day-to-day</option>";
			html += (!this.data[l].type) ? "<option value='1'>Long term</option>" : "<option value='1' selected>Long term</option>";
			html += "</td><td>"+this.data[l].list.length+"</td>";
			html +=  "<td class='delete'>Delete</td></tr>";
			$("#todo-table").append(html);
		}
	}

	moveToNextDay(){
		var nd = new Date(this.data[$("#todo-select").val()].list[this.selected_item].date);
		this.data[$("#todo-select").val()].list[this.selected_item].date = nd.addDays(1);
		this.saveData();
		this.populateTodoList($("#todo-select").val());
	}

	moveToLastDay(){
		var nd = new Date(this.data[$("#todo-select").val()].list[this.selected_item].date);
		this.data[$("#todo-select").val()].list[this.selected_item].date = nd.subtractDays(1);
		this.saveData();
		this.populateTodoList($("#todo-select").val());
	}

	deleteDay(){
		this.data[$("#todo-select").val()].list.splice(this.selected_item,1);
		this.saveData();
		this.populateTodoList($("#todo-select").val());
	}

	optionsOnclicks(){
		var self = this;
		$('#todo-table').on('click', '.delete', function() {
			self.data.splice($(this).parent().attr('id').substring(5), 1);
			self.saveData();
			self.populateOptionsTable();
		});

		$("#add-todo").click(function(){
			self.data.push({'name':'Unnamed', 'type': 0, 'list': []});
			self.saveData();
			self.populateOptionsTable();
		});

		$("#todo-table").on('change', 'input', function() {
			self.data[$(this).parent().parent().attr("id").substring(5)].name = $(this).val();
			self.saveData();
		});

		$("#todo-table").on('change', 'select', function() {
			self.data[$(this).parent().parent().attr("id").substring(5)].type = parseInt($(this).val());
			self.saveData();
		});
	}


	initPopup(){}

}
