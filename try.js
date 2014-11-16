var width=600,height=600;
var cx=450,cy=300,r=100;
var color=d3.scale.category20();
var svg=d3.select("body").append("svg").attr("width",width).attr("height",height).style("background-color","#FFFF66");
     
var force=d3.layout.force().charge(-150).linkDistance(50).size([width,height]);
var datas=[{"name":"When","number":1},{"name":"we","number":3},{"name":"go down","number":1},{"name":"the street","number":1},{"name":"if","number":1},{"name":"we","number":3},{"name":"take a notice","number":1},{"name":"on the couples","number":1},{"name":"we","number":3},{"name":"may","number":1},{"name":"find that","number":1},{"name":"besides","number":1},{"name":"those","number":1},{"name":"young girls","number":9},{"name":"there are","number":1},{"name":"not only","number":1},{"name":"young boys","number":2},{"name":"but also","number":1},{"name":"Da Shu","number":11},{"name":"Da Shu","number":11},{"name":"means","number":1},{"name":"these men","number":1},{"name":"who are","number":1},{"name":"in middle ages","number":1},{"name":"today","number":1},{"name":"many","number":1},{"name":"young girls","number":9},{"name":"crush on","number":1},{"name":"Da Shu","number":11},{"name":"their love for","number":1},{"name":"Da Shu","number":11},{"name":"have many reasons","number":1},{"name":"On the one hand","number":1},{"name":"Da Shu","number":11},{"name":"have stable job","number":1},{"name":"which","number":1},{"name":"brings girls security","number":9},{"name":"Da Shu","number":11},{"name":"have fought for","number":1},{"name":"their future","number":1},{"name":"for a certain time","number":1},{"name":"so they have","number":2},{"name":"earn some reputation","number":1},{"name":"and","number":4},{"name":"own good income","number":1},{"name":"they can","number":1},{"name":"afford almost","number":1},{"name":"what the girls want","number":9},{"name":"satisfying the girls","number":9},{"name":"in materials","number":1},{"name":"Comparing with the","number":1},{"name":"young boys","number":2},{"name":"who","number":2},{"name":"are","number":4},{"name":"struggling for","number":1},{"name":"the living","number":1},{"name":"and","number":4},{"name":"make ends meet","number":1},{"name":"young girls","number":9},{"name":"prefer to choose","number":1},{"name":"Da Shu","number":11},{"name":"On the other hand","number":1},{"name":"Da Shu","number":11},{"name":"have mature mind","number":1},{"name":"their broad vision","number":1},{"name":"is such a great charm","number":1},{"name":"that attracts the","number":1},{"name":"young girls","number":9},{"name":"As","number":1},{"name":"Da Shu","number":11},{"name":"are","number":4},{"name":"not young anymore","number":1},{"name":"they have","number":2},{"name":"gone through","number":1},{"name":"many difficulties","number":1},{"name":"and","number":4},{"name":"their life experience","number":1},{"name":"are","number":4},{"name":"so rich","number":1},{"name":"Young girls","number":9},{"name":"haven¡¯t experienced","number":1},{"name":"these before","number":1},{"name":"they are","number":4},{"name":"so curious about","number":1},{"name":"what the","number":1},{"name":"Da Shu","number":11},{"name":"experienced","number":1},{"name":"like reading","number":1},{"name":"an interesting book","number":1},{"name":"Young girls","number":9},{"name":"affection for","number":1},{"name":"Da Shu","number":11},{"name":"shows that","number":1},{"name":"they are","number":4},{"name":"eager to be mature","number":1},{"name":"and","number":4},{"name":"explore the world","number":1},{"name":"while they should","number":1},{"name":"grow up","number":1},{"name":"by themselves","number":1},{"name":"instead of","number":1},{"name":"putting their emotion","number":1},{"name":"on the older men","number":1}];

var text=svg.selectAll(".text").data(datas).enter().append("text")
          .text(function(d){return d.name;}).style("fill",function(d){return color(d.number);})
		  .style("font-size",function(d){return d.number*10+'px';}).call(force.drag);	


     force.nodes(datas).on("tick",function(){text.attr("transform", transform);}).start();

function transform(d){
  return "translate(" + d.x + "," + d.y + ")";
}



//function fontSize(){
	     
		// var a= new Array();
	//for(var i=0;i<datas.length;i++)
	//{   
		//var word=datas[i].name;
		//a[i]=50;
		//for(var j=0;j<datas.length;j++)
		//{
			//if( word==datas[j].name)
	          //  a[i]=a[i]+100;		
		//}

	//}
//}

