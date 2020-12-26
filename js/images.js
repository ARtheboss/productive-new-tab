
class ImageLoader {

	constructor(loc = 'tab'){
		this.images = [];
		this.init(loc);
	}

	async init(loc){
		try{
			this.images = JSON.parse(localStorage.getItem('images'));
		}catch(err){
			this.images = ['https://www.mepixels.com/cache/61e52391/4k-ultra-hd-desktop-wallpaper-1140x1140-ya2Qw1kIC.jpeg','https://c.pxhere.com/photos/94/59/blue_sky_building_cold_colorful_daylight_desktop_backgrounds_glacier_HD_wallpaper-1525457.jpg!d','https://c.pxhere.com/photos/c2/4b/blue_sky_clouds_flying_HD_wallpaper_over_the_clouds_sky-911793.jpg!d'];
			this.saveImages(false);
		}
		try{
			this.shownImages = JSON.parse(localStorage.getItem('shownImages'));
		}catch(err){
			this.shownImages = [];
		}
		this.notShown = [];
		for(var i = 0; i < this.images.length; i++){
			if(!this.shownImages.includes(i)) this.notShown.push(i);
		}
		if(this.images == null){
			this.images = ['https://www.mepixels.com/cache/61e52391/4k-ultra-hd-desktop-wallpaper-1140x1140-ya2Qw1kIC.jpeg','https://c.pxhere.com/photos/94/59/blue_sky_building_cold_colorful_daylight_desktop_backgrounds_glacier_HD_wallpaper-1525457.jpg!d','https://c.pxhere.com/photos/c2/4b/blue_sky_clouds_flying_HD_wallpaper_over_the_clouds_sky-911793.jpg!d'];
			this.saveImages(false);
		}
		for(var i = 0; i < this.images.length; i++){
			this.images[i] = new TabImage(this.images[i]);
			await this.images[i].setImage();
		}
		if(loc == 'tab'){
			this.startSlideshow();
		}else{
			await this.populateOptions();
			this.optionsOnclicks();
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
	saveShown(){
		localStorage.setItem('shownImages', JSON.stringify(this.shownImages));
	}

	nextImage(){
		if(this.notShown.length == 0){
			this.shownImages = [];
			this.saveShown();
			for(var i = 0; i < this.images.length; i++) this.notShown.push(i);
		}
		var ts = Math.round(Math.random() * (this.notShown.length-1));
		var r = this.notShown[ts];
		this.notShown.splice(ts, 1);
		return r;

	}
	startSlideshow(){
		this.showImage(this.nextImage());
		var self = this;
		setInterval(function(){
			self.showImage(this.nextImage());
		}, 20000);
	}

	showImage(i){
		this.shownImages.push(i);
		this.saveShown();
		$('body').css('background','url('+this.images[i].url+')');
	}

	async populateOptions(){
		$('#image-space').html("");
		for(var i = 0; i < this.images.length; i++){
			$('#image-space').append("<span class='image' id='image-"+i+"'><i class='delete-image fa fa-minus-circle'></i><img src='"+this.images[i].url+"'></span>");
		}
	}
	async optionsOnclicks(){
		var self = this;
		$('body').on('click', '.delete-image', function(){
			var id = $(this).parent().attr('id').substring(6);
			self.images.splice(id, 1);
			self.populateOptions();
			self.saveImages();
		});
		$('body').on('click', '#add-image', async function(){
			self.images.push(new TabImage($('#add-image-input').val()));
			await self.images[self.images.length-1].setImage();
			self.saveImages();
			await self.populateOptions();
			$('#add-image-input').val("");
		});
	}

}

function loadImage(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.addEventListener('load', e => resolve(img));
      img.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${url}`));
      });
      img.src = url;
	});
}
  

class TabImage {
	constructor(url){
		this.url = url;
	}
	async setImage(){
		var self = this;
		loadImage(self.url).then(img => self.image = img).catch(err => console.log(err));
	}
}