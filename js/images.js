
class ImageLoader {

	constructor(loc = 'tab'){
		this.images
		try{
			this.images = JSON.parse(localStorage.getItem('images'));
		}catch(err){
			this.images = ['https://www.mepixels.com/cache/61e52391/4k-ultra-hd-desktop-wallpaper-1140x1140-ya2Qw1kIC.jpeg','https://c.pxhere.com/photos/94/59/blue_sky_building_cold_colorful_daylight_desktop_backgrounds_glacier_HD_wallpaper-1525457.jpg!d','https://c.pxhere.com/photos/c2/4b/blue_sky_clouds_flying_HD_wallpaper_over_the_clouds_sky-911793.jpg!d'];
			this.saveImages(false);
		}
		if(this.images == null){
			this.images = ['https://www.mepixels.com/cache/61e52391/4k-ultra-hd-desktop-wallpaper-1140x1140-ya2Qw1kIC.jpeg','https://c.pxhere.com/photos/94/59/blue_sky_building_cold_colorful_daylight_desktop_backgrounds_glacier_HD_wallpaper-1525457.jpg!d','https://c.pxhere.com/photos/c2/4b/blue_sky_clouds_flying_HD_wallpaper_over_the_clouds_sky-911793.jpg!d'];
			this.saveImages(false);
		}
		for(var i = 0; i < this.images.length; i++){
			this.images[i] = new TabImage(this.images[i]);
		}
		if(loc == 'tab'){
			this.startSlideshow();
		}else{
			this.populateOptions();
			var self = this;
			setTimeout(function(){self.optionsOnclicks()}, 80);
		}
	}

	saveImages(alt = true){
		if(alt){
			var nim = [];
			for(var i = 0; i < this.images.length; i++)
				nim.push(this.images[i].url);
		}else{
			nim = this.images;
		}
		localStorage.setItem('images', JSON.stringify(nim));
	}

	startSlideshow(){
		var active = 0;
		this.showImage(active);
		var self = this;
		setInterval(function(){
			active++;
			if(active >= self.images.length) active = 0;
			self.showImage(active);
		}, 20000);
	}

	showImage(i){
		/*
		var self = this;
		$('body').fadeTo('slow', 0.3, function(){
		    $(this).css('background','url('+self.images[i].url+')');
		}).fadeTo('slow', 1);
		*/
		$('body').css('background','url('+this.images[i].url+')');
	}

	populateOptions(){
		$('#image-space').html("");
		for(var i = 0; i < this.images.length; i++){
			$('#image-space').append("<span class='image' id='image-"+i+"'><i class='delete-image fa fa-minus-circle'></i><img src='"+this.images[i].url+"'></span>");
		}
	}
	optionsOnclicks(){
		var self = this;
		$('body').on('click', '.delete-image', function(){
			var id = $(this).parent().attr('id').substring(6);
			self.images.splice(id, 1);
			self.populateOptions();
			self.saveImages();
		});
		$('body').on('click', '#add-image', function(){
			self.images.push(new TabImage($('#add-image-input').val()));
			self.saveImages();
			self.populateOptions();
		});
	}

}

class TabImage {

	constructor(url){
		this.url = url;
		this.image = new Image;
		this.image.src = this.url;
	}

}