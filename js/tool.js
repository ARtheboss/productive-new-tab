
var tool_dict = {'todo':{'description':'A todo list to keep track of your deliverables'},'tab-groups':{'description':'A way to open a saved group of tabs together'},'reading-list':{'description':'Save the materials you wanted to look at for later.'}}

const aLocalStorage = {
    setItem: async function (key, value) {
        await null;
        return localStorage.setItem(key, value);
    },
    getItem: async function (key) {
        await null;
        return localStorage.getItem(key);
    }
};


class Tool {

	constructor(loc, tool){
		this.tool = tool;
		this.loc = loc;
	}

	async initPage(){
		if(this.loc == "tab"){
			await this.initTab();
		}else if(this.loc == "options"){
			await this.initOptions();
		}else if(this.loc == "popup"){
			this.initPopup();
		}
	}

	async saveData(){
		await aLocalStorage.setItem(this.tool, JSON.stringify(this.data))
	}

	async initTab(){
		$('body').append("<div id='menu-"+this.tool+"' class='menu'></div>");
		$("#menu-bar").append("<span class='nav-item' id='n-"+this.tool+"'><i class='fa fa-"+this.fa+"'></span>");
		var self = this;
		$("#menu-"+this.tool).load('../'+this.tool+'/tab.html', function(){
			self.tabOnclicks();
		});
	}

	async initOptions(){
		$('#content').append("<div id='menu-"+this.tool+"' class='menu'></div>");
		$("#sidebar").append("<div class='sidemenu' id='n-"+this.tool+"'>"+this.tool+"</div>");
		var self = this;
		$("#menu-"+this.tool).load('../'+this.tool+'/options.html', function(){
			self.optionsOnclicks();
		});
	}

	hideMenu(){
		$("#menu-"+this.tool).hide();
	}
	showMenu(){
		$("#menu-"+this.tool).show();
		if(this.loc == 'tab') $("#n-"+this.tool).addClass('active');
		this.populateData();
	}

	async getCurrentTab(){
		var query = { active: true, currentWindow: true };
		var self = this;
		function callback(tabs) {
			self.tab = tabs[0].url;
		}
		await chrome.tabs.query(query, callback);
	}

}

Tool.prototype.toString = function (){
	return this.tool;
}


class ToolManager {

	constructor(loc){
		this.tools = [];
		this.loc = loc;
	}
	async init(st = true){
		try{
			this.tools = JSON.parse(await aLocalStorage.getItem('tools'));
		}catch(err){
			this.tools = ['todo','tab-groups'];
		}
		if(this.tools == null){
			this.tools = ['todo','tab-groups'];
		}
		await this.saveData();
		if(st){
			var self = this;
			setTimeout(function(){self.showTool(self.tools[0].tool)},200);
		}
	}
	async saveData(){
		await aLocalStorage.setItem('tools', JSON.stringify(this.tools));
		if(this.loc == 'options'){
			$('#sidebar').html("<div class='welcome'>Welcome, Advay</div><div class='sidemenu' id='n-general'>general</div>")
			$('.welcome').html("Welcome, "+await aLocalStorage.getItem('name'));
		}
		for (var i = 0; i < this.tools.length; i++) {
			if(this.tools[i] == 'todo')
				this.tools[i] = new Todo(this.loc);
			else if(this.tools[i] == 'tab-groups')
				this.tools[i] = new TabGroup(this.loc);
			else if(this.tools[i] == 'reading-list')
				this.tools[i] = new ReadingList(this.loc);
			await this.tools[i].initPage();
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