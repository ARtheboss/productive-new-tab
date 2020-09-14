var colors;

try{
	colors = JSON.parse(localStorage.getItem('colors'));
}catch(err){
	colors = ['#64646e','#c8c8cd','#fafaff'];
	saveColors();
}
if(colors == null){
	colors = ['#64646e','#c8c8cd','#fafaff'];
	saveColors();
}

function saveColors(change = false){
	if(change) changeColors();
	localStorage.setItem('colors', JSON.stringify(colors))
}

function scaleDownHex(c){
	c = c.substring(1);
	var hexStr = Math.round(parseInt(c.substring(0,2), 16) * 0.95).toString(16)+Math.round(parseInt(c.substring(2,4), 16) * 0.95).toString(16)+Math.round(parseInt(c.substring(4), 16) * 0.95).toString(16);
	while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
	return "#"+hexStr;
}
$(document).ready(function(){changeColors()});

function changeColors(){
	$("html").get(0).style.setProperty('--colorOne', colors[0]);
	$("html").get(0).style.setProperty('--colorOneHov', scaleDownHex(colors[0]));
	$("html").get(0).style.setProperty('--colorTwo', colors[1]);
	$("html").get(0).style.setProperty('--colorTwoHov', scaleDownHex(colors[1]));
	$("html").get(0).style.setProperty('--colorText', colors[2]);
	$("html").get(0).style.setProperty('--colorTextHov', scaleDownHex(colors[2]));
}