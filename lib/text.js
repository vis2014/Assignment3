//Width and height
var w = 1300;
var h = 550;

var format = d3.format(",d");
var color = d3.scale.category10();
var scale = d3.scale.linear();

//Create SVG element
var svg = d3.select("body")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
            .attr("class", "bubbles");

//Initialize a default pack layout for bubbles
var bubble = d3.layout.pack()
					  .sort(null)
					  .size([w, h])
					  .padding(4);
 
//Global root
var root;

d3.json("data/text.json", function(error, json) {
	if (error) {
		console.log('loading JSON fail!', error);
	} else {
		root = json;

        var allRadius = [];
		//Create nodes group
		var nodes = svg.selectAll(".nodes")
		               .data(bubble.nodes(classes(root))
                       .filter(function(d) { return !d.children; }))
                       .enter()
                       .append("g")
                       .attr("class", "nodes")
                       .attr("transform", function(d) {
                            allRadius.push(d.r);
                            return "translate(" + d.x + "," + d.y + ")"; })
                       .on("mouseover", mouseover)
                       .on("mouseout", mouseout)
                       .on("click",click);

        //Map the radius to opacity[0.4, 0.9] 
        scale.domain([d3.min(allRadius), d3.max(allRadius)])
             .range([0.4, 0.9]);

        //Hover to see title
        nodes.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

		//Create nodes as circles
		nodes.append("circle")
			.attr("r", function(d) { return d.r; })
            .attr("class", "circles")
            .style("fill", function(d) { return color(d.packageName); })
            .style("opacity", function(d) { return scale(d.r); });

        //Text for className
		nodes.append("text")
			.attr("class", "text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
            .style("font-size", function(d) { return (d.r) / 2.2 + "px"; })
            .style("opacity", function(d) { return scale(d.r); })
			.text(function(d) { return d.className; });
	}
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
    var classes = [];

    function recurse(name, node) {
        if (node.children) {
            node.children.forEach(function(child) {
                recurse(node.name, child);
            });
        } else {
            classes.push({packageName: name, className: node.name, value: node.count});
        }
    }

    recurse(null, root);
    return {children: classes};
}

//Click to show the description
function click(d) {
    var value =  format(d.value);
    if(value>=20)
    document.getElementById("description").innerHTML = "The word \"<span>" + d.className + "</span>\" is mentioned <span>" + format(d.value) + "</span> times.<br/> You <span> can </span>use it in your retrieval type.";
    else
        document.getElementById("description").innerHTML = "The word \"<span>" + d.className + "</span>\" is mentioned <span>" + format(d.value) + "</span> times.<br/> You would better <span>not</span>  use it in your retrieval type.";
}

//Emphasize the node when move over
function mouseover(d) {
    d3.select(this).select("circle")
        .transition()
        .duration(200)
        .style("opacity", "1");

	d3.select(this).select("text")
        .transition()
        .duration(200)
        .style("opacity", "1")
        .style("font-weight", "bold");
}

//Get back to original status
function mouseout(d) {
    d3.select(this).select("circle")
        .transition()
        .duration(300)
        .style("opacity", function(d) { return scale(d.r); });

	d3.select(this).select("text") 
		.transition()
		.duration(300)
        .style("opacity", function(d) { return scale(d.r); })
		.style("font-weight", "normal");
}