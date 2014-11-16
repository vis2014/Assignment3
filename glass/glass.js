/**
 * Created by liyp on 14-11-12.
 */
var Type = ["build_wind_float",
        "build_wind_non-float",
        "vehic_wind_float",
        "vehic_wind_non-float",
        "containers",
        "tableware",
        "headlamps"],
    traits = ["RI", "Na", "Mg", "Al", "Si",
        "K", "Ca", "Ba", "Fe"];

var m = [25, 20, 200, 80],
    w = 1200 - m[1] - m[3],
    h = 800 - m[0] - m[2];

var x = d3.scale.ordinal().domain(traits).rangePoints([0, w]),
    y = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    foreground;

var svg = d3.select("#vis").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var timer = {};
var turn = 0;

d3.csv("glass.csv", function(glass) {
    // Create a scale and brush for each trait.
    traits.forEach(function(d) {
        // Coerce values to numbers.
        glass.forEach(function(p) { p[d] = +p[d]; });             //???????????????????????

        y[d] = d3.scale.linear()
            .domain(d3.extent(glass, function(p) { return p[d]; }))
            .range([h, 0]);

        y[d].brush = d3.svg.brush()
            .y(y[d])
            .on("brush", brush);
    });

    // Add a legend.
    var legend = svg.selectAll("g.legend")
        .data(Type)
        .enter().append("svg:g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });

    legend.append("svg:line")
        .attr("class", String)
        .attr("x2", 8);

    //图下面的标签
    legend.append("svg:text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(function(d) { return  d; })
        .on("click", function(p){
//            foreground.transition().attr("class", "melt");
            foreground.classed("melt", function(d){return d.Type != p;});
//                filter(function(d){return d.Type != p}).transition()
//                .attr("class","melt");//function(d){return d.Type});
        });

    // Add foreground lines.
    foreground = svg.append("svg:g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(glass)
        .enter().append("svg:path")
        .attr("d", path)
        .attr("class", function(d) { return d.Type; })
    ;

    foreground.on("mouseover", function(d) {
        foreground.classed("notselect", function(p){return d!=p});
        foreground.classed("select", function(p){return d==p});
        foreground.filter(function(p){
            return d==p;
        }).append("title").text(function(d){
                var text="";
                text= d.Type+"\n"+"RI:"+ d.RI+"\n" +"Na:"+ d.Na+"\n"+"Mg:"+ d.Mg+"\n"+"Al:"+ d.Al+"\n"+"Si:"+ d.Si+"\n"+
                    "K:"+ d.K+"\n"+"Ca:"+ d.Ca+"\n"+ "Ba:"+ d.Ba+"\n"+ "Fe:"+ d.Fe;
                return text;
            });
    });

    foreground.on("mouseout", function(d) {
        foreground.classed("notselect", false);
        foreground.classed("select", false);
    });


    // Add a group element for each trait.
    var g = svg.selectAll(".trait")
        .data(traits)
        .enter().append("svg:g")
        .attr("class", "trait")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", dragstart)
            .on("drag", drag)
            .on("dragend", dragend));

    // Add an axis and title.添加数轴与上面的标签
    g.append("svg:g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(String);

    // Add a brush for each axis.在数轴上添加刷子
    g.append("svg:g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    //刷子的函数
    function dragstart(d) {
        i = traits.indexOf(d);
    }

    function drag(d) {
        x.range()[i] = d3.event.x;
        traits.sort(function(a, b) { return x(a) - x(b); });
        g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        foreground.attr("d", path);
    }

    function dragend(d) {
        x.domain(traits).rangePoints([0, w]);
        var t = d3.transition().duration(500);
        t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        t.selectAll(".foreground path").attr("d", path);
    }
});

function playOn(){
    timer = setInterval(showInTurn, 2000);
}

function playOff(){
    clearInterval(timer);
}

function reSet(){
    foreground.classed("melt", false);
    foreground.classed("fade", false);
    foreground.classed("notselect", false);
}

function showInTurn(){
    foreground.classed("melt", function(d){return d.Type != Type[turn%Type.length]});
    turn++;
}

// Returns the path for a given data point.
function path(d) {
    return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
    var actives = traits.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.classed("fade", function(d) {
        return !actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        });
    });
}
