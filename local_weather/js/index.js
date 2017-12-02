var unitIsF = true;
var degrees = {true:{unit:"F", value:0}, false:{unit:"C", value:0}};

function processJSON(data) {
  var city = data.name + ', ' + data.sys.country;
  degrees[true].value = Math.round(convertDegrees(data.main.temp, true));
  degrees[false].value = Math.round(convertDegrees(data.main.temp, false));
  var icon = data.weather[0].icon;
  var description = capitalize(data.weather[0].main);
  
 $("#city").html(city);
 $("#degree").html(degrees[unitIsF].value + "°" + degrees[unitIsF].unit);   
 $("#icon").html("<img width=64px src=\"http://openweathermap.org/img/w/" + icon + ".png\">"); 
 $("#description").html(description); 
}

function processGeoData(position)  {
 var url = "https://api.openweathermap.org/data/2.5/weather?"; 
  
  var req = url + "lat="+position.latitude + "&lon=" + position.longitude + "&APPID=4b7c47eb13e7049686e15a7df0ac84ab";
       
  $.getJSON(req, processJSON);
} 

function convertDegrees(degrees, unitIsF) {
  if (!unitIsF)
    return degrees - 273.15;
  return degrees*1.8 - 459.67; // default to F
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1);
}

$(document).ready(function(){
  //processGeoData
  $.getJSON("https://www.geoip-db.com/json/", processGeoData)
  .done(function() {})
  .fail(function() { 
    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(processGeoData);  
    }
    */
  });
  
  $("#degree").on('click', function() {
    console.log("switch");     
    unitIsF = !unitIsF;  
    $("#degree").html(degrees[unitIsF].value + "°" +  degrees[unitIsF].unit);   
  });
});