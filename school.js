//定义图像的和网页的相关属性
var width  = 600;
var height = 600;

var pack = d3.layout.pack()
    .size([ width, height ])
    .radius(30);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");


d3.json("data/school.json", function(error, root) {

    var nodes = pack.nodes(root);
    var links = pack.links(nodes);


    console.log(nodes);
    console.log(links);

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("fill","rgb(31, 119, 180)")
        .attr("fill-opacity","0.4")
        .attr("cx",function(d){
            return d.x;
        })
        .attr("cy",function(d){
            return d.y;
        })
        .attr("r",function(d){
            return d.r;
        })
        .on("mouseover",function(d,i){
            d3.select(this)
                .attr("fill","yellow");
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .attr("fill","rgb(31, 119, 180)");
        });

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("font-size","12px")
        .attr("fill","red")
        .attr("fill-opacity",function(d){
            if(d.depth == 2)
                return "0.9";
            else
                return "0";
        })
        .attr("x",function(d){ return d.x; })
        .attr("y",function(d){ return d.y; })
        .attr("dx",-25)
        .attr("dy",1)
        .text(function(d){ return d.name; });

});


