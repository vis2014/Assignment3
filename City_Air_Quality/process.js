var List = [ "BeiJing","ShiJianZhuang","WuHan","ShenYang"];

var m = [30, 10, 10, 10],
    w = 1360,
    h = 700;
	
	
var x = d3.scale.ordinal().rangePoints([0, w], .5),
    y = {};
	
	
var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;
	
	
var svg = d3.select("body").append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] +")");

d3.csv("City_Air_Quality.csv", function(cities) {
  
    x.domain(dimensions = d3.keys(cities[0]).filter(function(d) {
      if(d=="name")
	  return y[d]=d3.scale.ordinal().rangePoints([0, h]).domain(cities.map(function(t) { return t[d]; }));
	 
	  if(d=="AQI")
	  return (y[d] = d3.scale.linear().domain(d3.extent(cities, function(s) { return +s[d]; })).range([h, 0]));
	  
	  if(d=="PM2.5")
	  return (y[d] = d3.scale.linear().domain(d3.extent(cities, function(s) { return +s[d]; })).range([h, 0]));
	  
	  if(d=="PM10")
	  return (y[d] = d3.scale.linear().domain(d3.extent(cities, function(s) { return +s[d]; })).range([h, 0]));
	  
	  if(d=="NO2")
	  return (y[d] = d3.scale.linear().domain(d3.extent(cities, function(s) { return +s[d]; })).range([h, 0]));
	  
	  if(d=="SO2")
	  return (y[d] = d3.scale.linear().domain(d3.extent(cities, function(s) { return +s[d]; })).range([h, 0]));
	  
  }));
  
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(cities)
    .enter().append("path")
      .attr("d", path);
  
  foreground = svg.append("g")
    .attr("class", "foreground")
	.selectAll("path")
    .data(cities)
    .enter().append("path")
    .attr("d", path);
	  
  var g = svg.selectAll(".dimension")
    .data(dimensions)
    .enter().append("g")
    .attr("class", "dimension")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    
  
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);
  
  g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
});



function refreshProcess(){
	var selectInput = document.getElementById("province")  
    alert(selectInput.options[selectInput.selectedIndex].text);
	var selectProvince=selectInput.options[selectInput.selectedIndex].value;
	alert(selectProvince);
};

function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

function brush() {
  var texts_ = document.getElementsByTagName("text");
    for(var j=0;j<texts_.length;j++){
            texts_[j].setAttribute("fill",null);
        }
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
        if(p == "name"){
            var temp;
            for(var j=0;j<List.length;j++){
                if(List[j] == d[p])
                {temp = j+1;break;}
            }
            if(extents[i][0] <= temp*460/50 && temp*460/50 <= extents[i][1]){
                var texts = document.getElementsByTagName("text");
                for(var j=0;j<texts.length;j++){
                    if(texts[j].innerHTML == d["name"]){
                        texts[j].setAttribute("fill","red");
                    }
                }
            }
            else{
                var texts = document.getElementsByTagName("text");
                for(var j=0;j<texts.length;j++){
                    if(texts[j].innerHTML == d["name"]){
                        texts[j].setAttribute("fill",null);
                    }
                }
            }
            return extents[i][0] <= temp*460/50 && temp*460/50 <= extents[i][1];
        }
        if(extents[i][0] <= d[p] && d[p] <= extents[i][1]){
            var texts = document.getElementsByTagName("text");
            for(var j=0;j<texts.length;j++){
                if(texts[j].innerHTML == d["name"]){
                    texts[j].setAttribute("fill","red");
                }
            }
        }
        else{
            var texts = document.getElementsByTagName("text");
            for(var j=0;j<texts.length;j++){
                if(texts[j].innerHTML == d["name"]){
                    texts[j].setAttribute("fill",null);
                }
            }
        }
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}