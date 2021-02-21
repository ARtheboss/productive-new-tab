
class Notes extends Tool{

	constructor(loc){
		super(loc, 'notes');
		this.fa = 'sticky-note'
		this.loc = loc;
		this.default_data = [{'title': 'New Note', 'content':'Add content here'}];
		this.quill;
		this.active_note = 0;
	}

	tabOnclicks(){
		var self = this;
		$("#notes-editor").on("keyup", function(){
			self.data[self.active_note].content = self.quill.root.innerHTML;
			self.saveData();
		});
		$("#add-note").on("click", function(){
			self.data = self.data.concat(self.default_data);
			self.saveData();
			self.populateData(self.active_note);
		});
		$("#delete-note").on("click", function(){
			self.data.splice(self.active_note--, 1);
			self.saveData();
			self.populateData(self.active_note);
		});
		$("#notes").on("click", ".note-title", function(e){
			if($(e.target).prop("tagName") == "INPUT") return;
			self.active_note = $(this).attr("id").substring($(this).attr("id").indexOf("-")+1);
			self.populateData(self.active_note);
		});
		$("#notes").on("keyup", "input", function(){
			var id = $(this).parent().attr("id").substring($(this).parent().attr("id").indexOf("-")+1);
			self.data[id].title = $(this).val();
			self.saveData();
		});
	}

	async populateData(act = 0){
		if(this.loc == 'tab'){
			await this.getData();
			if(act > -1 && this.data.length > 0){
				this.initQuill();
				$("#notes-content").css("background", "var(--colorOne)");
			}else{
				$("#notes-editor").html("No notes selected");
				$("#notes-content").css("background", "var(--colorTwo)");
			}
			var html;
			$("#notes").html("");
			for(var i = 0; i < this.data.length; i++){
				if(i == act){
					html = "<div class='note-title active' id='note-"+i+"'><input type='text' value='"+this.data[i].title+"'></div>";
					this.quill.root.innerHTML = this.data[i].content;
				}else html = "<div class='note-title' id='note-"+i+"'>"+this.data[i].title+"</div>";
				$("#notes").append(html);
			}
		}else{
			this.populateOptionsTable();
		}
	}

	initQuill(){
		this.quill = new Quill("#notes-editor",{
			theme: "bubble",
		});
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