
var lsdata;

function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(lsdata)));
    element.setAttribute('download', 'new-tab-'+new Date().toISOString()+".txt");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function upload(){
    var fileToLoad = document.getElementById("to-upload").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        var data = JSON.parse(textFromFileLoaded);

        for(var key in data){
            localStorage.setItem(key, data[key]);
        }

        alert("Success");
    };

    fileReader.readAsText(fileToLoad, "UTF-8");
}

function allStorage() {

    var values = {},
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values[keys[i]] = localStorage.getItem(keys[i]);
    }

    return values;
}

$(document).ready(function() {
    lsdata = allStorage();
    $("#download-data").on('click', function(){
        download();
    });
    $("#upload-data").on('click', function(){
        if(confirm("Are you sure you want to overwrite existing data?")) upload();
    });
});