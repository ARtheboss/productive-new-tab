
class TabGroup extends Tool{

	constructor(loc){
		super(loc, 'tab-groups');
		this.fa = 'external-link'
		this.loc = loc;
		this.initPage();
	}

	getData(){
		this.data = [];
		try{
			this.data = JSON.parse(localStorage.getItem('tab-groups'));
		}catch(err){
			this.data = [{'name':'Sample', 'list': ['https://www.google.com']}];
			this.saveData();
		}
		if(this.data == null){
			this.data = [{'name':'Sample', 'list': ['https://www.google.com']}];
			this.saveData();
		}
	}

	tabOnclicks(){
		var self = this;
		$("#tab-groups-cont").on("click", ".tab-group-item", function(){
			self.clickHandler($(this).attr("id").substring(0, $(this).attr("id").length - 6));
		});
		$("#tab-groups-cont").on("click", ".tg-icon", function(){
			self.clickHandler($(this).parent().attr("id").substring(0, $(this).parent().attr("id").length - 6), true);
		});
	}

	populateData(){
		if(this.loc == 'tab'){
			this.getData();
			$("#tab-groups-cont").html("");
			for(var i = 0; i < this.data.length; i++){
				var html = "<div class='tab-group-item' id='"+i+"-group'><div class='tg-text'>"
				html += "<h2 class='tg-title'>"+this.data[i].name+"</h2>";
				html += "<p class='tg-subtitle'>Under work</p>"
				html += "</div><div class='tg-icon'><i class='fa fa-window-restore'></i></div></div>";
				$("#tab-groups-cont").append(html);
			}
		}else{
			this.populateOptionsTable();
		}
	}

	clickHandler(id, new_window = false){
		if(new_window){
			alert("Cannot open in new window. Open this new tab in new window and click on tab group again.")
		}else{
			var l = this.data[id].list;
			for(var i = 0; i < l.length; i++){
				window.open(l[i]);
			}
			window.close();
		}
	}

	populateOptionsTable(){
		this.getData();
		$("#tg-table").html("<tr><th style='width: 20%;'>Name</th><th>Links</th><th>Delete</th></tr>");
		for(var l = 0; l < this.data.length; l++){
			var html = "<tr id='tg-"+l+"'>";
			html += "<td><input value='"+this.data[l].name+"'></td>";
			html += "<td><textarea>";
			var list = this.data[l].list;
			for(var link = 0; link < list.length; link++){
				html += list[link] + "\n";
			}
			html += "</textarea></td>";
			html +=  "<td class='delete'>Delete</td></tr>";
			$("#tg-table").append(html);
		}
	}

	optionsOnclicks(){
		var self = this;
		$('#tg-table').on('click', '.delete', function() {
			self.data.splice($(this).parent().attr('id').substring(3), 1);
			self.saveData();
			self.populateOptionsTable();
		});

		$("#add-tg").click(function(){
			self.data.push({'name':'Unnamed', 'list': []});
			self.saveData();
			self.populateOptionsTable();
		});

		$("#tg-table").on('change', 'input', function() {
			self.data[$(this).parent().parent().attr("id").substring(3)].name = $(this).val();
			self.saveData();
		});

		$("#tg-table").on('change', 'textarea', function() {
			var list = $(this).val().split('\n');
			self.data[$(this).parent().parent().attr("id").substring(3)].list = list;
			self.saveData();
		});
	}


	initPopup(){
		$("#content").append("<div class='tool' id='t-tg'><div class='tool-title'>tab-groups</div><div class='tool-content' id='t-tg-cont'></div></div>");
		$("#t-tg-cont").load('../tab-groups/popup.html');

		var self = this;
		setTimeout(function(){
			self.getData();
			for (var i = 0; i < self.data.length; i++) {
				$("#my-tgs").append("<option value='"+i+"'>"+self.data[i].name+"</option>");
			}
		}, 50);

		setTimeout(function(){self.popupOnclicks()}, 50);
	}
	popupOnclicks(){
		var self = this;
		$("#add-to-tg-but").on('click', function(){
			self.getCurrentTab();
			setTimeout(function(){
				self.data[$("#my-tgs").val()].list.push(self.tab);
				self.saveData();
			}, 50);
		});
	}

}