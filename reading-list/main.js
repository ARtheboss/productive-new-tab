
class ReadingList extends Tool{

	constructor(loc){
		super(loc, 'reading-list');
		this.fa = 'book'
		this.loc = loc;
		this.justdeleted = false;
	}

	async getData(){
		this.data = [];
		try{
			this.data = JSON.parse(await aLocalStorage.getItem('reading-list'));
		}catch(err){
			this.data = [{'title': 'Google', 'url':'https://www.google.com'}];
			await this.saveData();
		}
		if(this.data == null){
			this.data = [{'title': 'Google', 'url':'https://www.google.com'}];
			await this.saveData();
		}
	}

	tabOnclicks(){
		var self = this;
		$("#reading-list-cont").on("click", ".tab-group-item", function(){
			self.clickHandler($(this).attr("id").substring(0, $(this).attr("id").length - 5));
		});
		$("#reading-list-cont").on("click", ".tg-icon", function(){
			self.justdeleted = true;
			self.delete($(this).parent().attr("id").substring(0, $(this).parent().attr("id").length - 5));
		});
	}

	clickHandler(id){
		if(this.justdeleted){
			this.justdeleted = false;
			return;
		}
		window.open(this.data[id].url);
	}

	async delete(id){
		this.data.splice(id, 1);
		await this.saveData();
		await this.populateData();
	}

	async populateData(){
		if(this.loc == 'tab'){
			await this.getData();
			$("#reading-list-cont").html("");
			for(var i = 0; i < this.data.length; i++){
				var html = "<div class='tab-group-item' id='"+i+"-list'><div class='tg-text'>"
				html += "<h2 class='tg-title'>"+/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img.exec(this.data[i].url)[1]+"</h2>";
				html += "<p class='tg-subtitle'>"+this.data[i].title+"</p>"
				html += "</div><div class='tg-icon'><i class='fa fa-remove'></i></div></div>";
				$("#reading-list-cont").append(html);
			}
		}else{
			this.populateOptionsTable();
		}
	}

	async populateOptionsTable(){
		await this.getData();
		
	}

	optionsOnclicks(){
		var self = this;
		
	}


	async initPopup(){
		await this.getData();
		$("#content").append("<div class='tool' id='t-rl'><div class='tool-title'>reading-list<div class='loader' id='rl-loader'></div></div><div class='tool-content' id='t-rl-cont'></div></div>");
		var self = this;
		$("#t-rl-cont").load('../reading-list/popup.html', function(){
			self.popupOnclicks();
		});
	}
	popupOnclicks(){
		var self = this;
		$("#add-to-rl-but").on('click', async function(){
			$("#rl-loader").show();
			chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs){
				await $.ajax({
					url: tabs[0].url,
					async: true,
					success: function(data) {
						var matches = data.match(/<title>(.*?)<\/title>/);
						if(!matches) self.data.push({'title': tabs[0].url, 'url':tabs[0].url});
						else self.data.push({'title': matches[0].substring(7, matches[0].length-8), 'url':tabs[0].url});
						self.saveData();
					}   
				});
				$("#rl-loader").hide();
			})
		});
	}

}