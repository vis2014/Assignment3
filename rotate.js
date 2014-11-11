/**
 * Created by Administrator on 14-11-11.
 */


var svg2 = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)

d3.select("#path").transition()
    .duration(5000)
    .attrTween("d", function() { return arc; });

var svg = d3.select("body").append("svg")
.attr("width", w)
.attr("height", h);

var thing = svg.append("g")
.attr("id", "thing")
.style("fill", "navy");

function textrotate(transform) {
    return function (node) {
    node.each(function() {
    var t = d3.transform(d3.functor(transform).apply(this, arguments));
    node.attr("alignment-baseline", "central");
    node.style("dominant-baseline", "central");
    if (t.rotate <= 90 && t.rotate >= -90) {
    node.attr("text-anchor", "begin");
    node.attr("transform", t.toString());
    } else {
    node.attr("text-anchor", "end");
    t.rotate = (t.rotate > 0 ? -1 : 1) * (180 - Math.abs(t.rotate));
    node.attr("transform", t.toString());
    }
    });
    }
    }

var w = 500, h = 500;

var n = d3.select("body").insert("svg")
.attr("width", w)
.attr("height", h)
.insert("g")
.attr("transform","translate(" + w/2 + "," + w/2 + ")");
n.insert("circle")
.attr("r", 5)
.attr("cx", 0)
.attr("cy", 0);

function f(rot) {
    n.select("text").call(textrotate("rotate("+rot+")translate(12,0)"));
    setTimeout(function() { f(rot+1) }, 25);
    }

function refreshSettings(){
    svg.append("defs").append("path")
        .attr("id", "s3")
        .attr("d", "M 10,90 Q 100,15 200,70 Q 340,140 400,30");

    thing.append("text")
    .style("font-size", "20px")
    .append("textPath")
    .attr("xlink:href", "#s3")
    .text(document.getElementById("mytext").value);

    thing.append("use")
    .attr("xlink:href", "#s3")
    .style("stroke", "black")
    .style("fill", "none");

    n.insert("text")
    .text(document.getElementById("mytext").value);

    f(0);
    }

