
var model={};

var dataset = [];

d3.json("title.json",function(json){
  model.json = json;
  dataset = model.json.topics.map(function(d){
    return {text: d.text, size : d.prob * 500, id :d.id, type: 1}
  });
  model.font = "微软雅黑";
  model.charge = -400;
  model.generate();

})
  
var w = 800, h = 700;

 var fill = d3.scale.category20();

model.layout = d3.layout.cloud().size([w, h])
      .padding(15)
      .fontSize(function(d) { return d.size; })
      .on("end", draw);
  
model.vis = d3.select("#content").append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(80,130)");


var mouseover = function(){
  var g = d3.select("g");

  g.selectAll("text")
    .data(dataset2)
    .transition()
    .duration(1000)
    .text(function(d){
      return d;
    });
}

function Scale(id){
  model.generate();
}

model.generate = function (){
  model.force = d3.layout.force()
  .nodes(dataset)
  .size([w/2, h/2])
  .charge(model.charge);

  model.layout
    .font(model.font);

  model.layout.stop().words(dataset).start();
  model.texts.style("font-family",model.font)
      .text(function(d) { return d.text; });
}

model.reforce = function(){
  model.force.on("tick", function() {
  model.texts.attr("transform", function(d) {
    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
  })});
}



function Font(value){
  model.font = value;
  model.generate();
}

function getTopicWords(id,text){
  dataset = model.json.tpcwords[id].words.map(function(d){
    return {text: d.text, size : 20 + d.prob * 500, id :d.id,type:2}
  });
  model.charge = -100;
  model.generate();
}

function getTopics(){
  dataset = model.json.topics.map(function(d){
    return {text: d.text, size : d.prob * 500, id :d.id, type: 1}
  });
  model.charge = -500;
   model.generate();
}
function draw(words) {
  if(model.texts)
    model.texts.remove();
  model.texts =  model.vis.selectAll("text")
      .data(words).enter().append("text");

  model.texts.style("font-size", function(d) { return d.size + "px"; })
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .on("click",function(d){
        if( d.type == 1)
          getTopicWords(d.id,d.text)
        else
          getTopics();
      })
      .call(model.force.drag)
      .style("opacity", 1e-6)
      .transition()
      .duration(1500)
      .style("opacity", 1)
      ;

  model.force.start();
  model.reforce();
} 

