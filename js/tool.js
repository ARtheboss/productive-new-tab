
var tool_dict = {'todo':{'description':'A todo list to keep track of your deliverables'},'tab-groups':{'description':'A way to open a saved group of tabs together'}}

class Tool {

	constructor(loc, tool){
		this.tool = tool;
		this.loc = loc;
	}

	initPage(){
		if(this.loc == "tab"){
			this.initTab();
		}else if(this.loc == "options"){
			this.initOptions();
		}else if(this.loc == "popup"){
			this.initPopup();
		}
	}

	saveData(){
		localStorage.setItem(this.tool, JSON.stringify(this.data))
	}

	initTab(){
		$('body').append("<div id='menu-"+this.tool+"' class='menu'></div>");
		$("#menu-"+this.tool).load('../'+this.tool+'/tab.html');

		this.createTabNav();

		var self = this;
		setTimeout(function(){self.tabOnclicks()}, 50);
	}
	createTabNav(){
		$("#menu-bar").append("<span class='nav-item' id='n-"+this.tool+"'><i class='fa fa-"+this.fa+"'></span>");
	}


	initOptions(){
		$('#content').append("<div id='menu-"+this.tool+"' class='menu'></div>");
		$("#menu-"+this.tool).load('../'+this.tool+'/options.html');

		this.createOptionsNav();

		var self = this;
		setTimeout(function(){self.optionsOnclicks()}, 50);
	}
	createOptionsNav(){
		$("#sidebar").append("<div class='sidemenu' id='n-"+this.tool+"'>"+this.tool+"</div>");
	}

	hideMenu(){
		$("#menu-"+this.tool).hide();
	}
	showMenu(){
		$("#menu-"+this.tool).show();
		if(this.loc == 'tab') $("#n-"+this.tool).addClass('active');
		this.populateData();
	}

	getCurrentTab(){
		var query = { active: true, currentWindow: true };
		var self = this;
		function callback(tabs) {
			self.tab = tabs[0].url;
		}
		chrome.tabs.query(query, callback);
	}

}

Tool.prototype.toString = function (){
	return this.tool;
}


class ToolManager {

	constructor(loc, st = true){
		this.tools = [];
		this.loc = loc;
		try{
			this.tools = JSON.parse(localStorage.getItem('tools'));
		}catch(err){
			this.tools = ['todo','tab-groups'];
		}
		if(this.tools == null){
			this.tools = ['todo','tab-groups'];
		}
		this.saveData();
		if(st){
			var self = this;
			setTimeout(function(){self.showTool(self.tools[0].tool)},50);
		}
	}
	saveData(){
		localStorage.setItem('tools', JSON.stringify(this.tools));
		if(this.loc == 'options'){
			$('#sidebar').html("<div class='welcome'>Welcome, Advay</div><div class='sidemenu' id='n-general'>general</div>")
			$('.welcome').html("Welcome, "+localStorage.getItem('name'));
		}
		for (var i = 0; i < this.tools.length; i++) {
			if(this.tools[i] == 'todo')
				this.tools[i] = new Todo(this.loc);
			else if(this.tools[i] == 'tab-groups')
				this.tools[i] = new TabGroup(this.loc);
		}
	}

	showTool(tool){
		for(var i = 0; i < this.tools.length; i++){
			if(this.tools[i] == tool)
				this.tools[i].showMenu();
			else
				this.tools[i].hideMenu();
		}
	}


}