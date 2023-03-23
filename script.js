let button = document.getElementById("searchbutton"); 

//search button calls the get method 
button.onclick = function(){ 
let cityname = document.getElementById("search").value; 
lookupCity(cityname) 
} 

//automatically pull up history on visit 
var listOfHistory = window.localStorage.getItem('list'); 
showHistory(); 

//history display 
function showHistory(){ 
let list = document.getElementById("listOfCity"); 
list.innerHTML =""; 
let i=0; 
let n=0; 
var button = ""; 
for(i = 0; i< listOfHistory.length; i++){ 
if(listOfHistory.charAt(i) == '/'){ 
if (n == 5){ break;} 
else{ 
list.innerHTML += "<li><button class='pastcity' onclick=lookupCity(\""+ button +"\")>" + button + "</button></li>"; 
button = ""; 
n++; 
} 
} 
else{ 
if(listOfHistory.charAt(i) == ' '){ 
button += "\u00A0"; 
} 
else{ 
button += listOfHistory.charAt(i); 
} 
} 
} 
} 
//adds previous searches to history 
function addHistory(name){ 
listOfHistory = name + "/" + listOfHistory; 
showHistory(); 
window.localStorage.setItem('list', listOfHistory); 
} 

//get method for coordinates by city name 
function lookupCity(cityname){ 
if (cityname != ""){ 

var xml = new XMLHttpRequest(); 
xml.onreadystatechange = function () { 

if (this.readyState == 4 && this.status == 200) { 
var data = JSON.parse(this.responseText); 
try{ 
getCoordinates(data); 
addHistory(cityname); 
} 
catch(error){ 
message = document.getElementById("entername"); 
message.style.color = "red"; 
message.innerHTML = "Error: Try Again :("; 
} 
} 
} 
xml.open("GET", "https://api.openweathermap.org/geo/1.0/direct?q="+ cityname + "&limit=1&appid=" +"a55306635157a3e154bd850c24a6cf33", true); 
xml.send(); 
} 

} 

//coordinates used to call for weather conditions get method 
function getCoordinates(json){ 
let lat = json[0].lat; 
let lon = json[0].lon; 
var test = document.getElementById("locationtoday"); 
test.innerHTML = lat + " " + lon; 
lookupWeather(lat,lon); 
} 

//get method function for weather 
function lookupWeather(lat,lon){ 
var xml = new XMLHttpRequest(); 
xml.onreadystatechange = function () { 

if (this.readyState == 4 && this.status == 200) { 
var data = JSON.parse(this.responseText); 
getForecast(data); 
} 
} 
xml.open("GET", "https://api.openweathermap.org/data/2.5/forecast?lat=" +lat+ "&lon=" + lon + "&appid=a55306635157a3e154bd850c24a6cf33&units=imperial", true); 
xml.send(); 
} 

//display the forecast on the HTML page 
function getForecast(jsondata){ 

//today's weather 
let datetime = jsondata.list[0].dt_txt; 
datetime = datetime.substring(0,11); 
let weather = jsondata.list[0].weather[0].main; 
var imgtype = ""; 
if (weather=="Clear"){ 
imgtype="01d.png"; 
} 
else if (weather =="Clouds"){ 
imgtype="02d.png"; 
} 
else if (weather =="Rain"){ 
imgtype="10d.png"; 
} 
else if (weather =="Snow"){ 
imgtype="13d.png"; 
} 
else if (weather =="Drizzle"){ 
imgtype = "09d.png"; 
} 
else if (weather =="Thunderstorm"){ 
imgtype = "11d.png"; 
} 
else{imgtype = "50d.png"} 

let temp = jsondata.list[0].main.temp; 
let speed = jsondata.list[0].wind.speed 
let humidity = jsondata.list[0].main.humidity; 
let location = jsondata.city.name + ", " + jsondata.city.country + ": "; 
let todaysDisplay = document.getElementById("locationtoday"); 
todaysDisplay.innerHTML = "<h3>" + location + datetime + "</h3> <img src=\""+imgtype+"\"> <p>Temp:" + temp + "</p> <p>Wind: " + speed + "</p> <p>Humidity: " + humidity + "</p>"; 

var i; 
//5- day forecast 
for(i=1; i < 6; i++){ 
let daynum = "day" + (i); 
let display = document.getElementById(daynum); 
let datetime = jsondata.list[(i*8)-1].dt_txt; 
datetime = datetime.substring(0,11); 

let weather = jsondata.list[(i*8)-1].weather[0].main; 
var imgtype = ""; 
if (weather=="Clear"){ 
imgtype="01d.png"; 
} 
else if (weather =="Clouds"){ 
imgtype="02d.png"; 
} 
else if (weather =="Rain"){ 
imgtype="10d.png"; 
} 
else if (weather =="Snow"){ 
imgtype="13d.png"; 
} 
else if (weather =="Drizzle"){ 
imgtype = "09d.png"; 
} 
else if (weather =="Thunderstorm"){ 
imgtype = "11d.png"; 
} 
else{imgtype = "50d.png"} 
let temp = jsondata.list[(i*8)-1].main.temp; 
let speed = jsondata.list[(i*8)-1].wind.speed; 
let humidity = jsondata.list[(i*8)-1].main.humidity; 
display.innerHTML = "<h3>" + datetime + "</h3> <img src=\""+imgtype+"\"> <p>Temp:" + temp + "</p> <p>Wind: " + speed + "</p> <p>Humidity: " + humidity + "</p>"; 
} 
message = document.getElementById("entername"); 
message.style.color = "black"; 
message.innerHTML = "Search for a City:"; 

var forecast = document.getElementById("forecast"); 
forecast.style.display="block"; 
} 
