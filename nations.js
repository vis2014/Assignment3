/**
 * Created by dell on 2014/11/11.
 */
// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d.income; }
function y(d) { return d.fertility; }
function radius(d) { return d.population; }
function color(d) { return d.region; }
function key(d) { return d.name; }

// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 159.5},
    width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.log().domain([50, 1e5]).range([0, width]),
    yScale = d3.scale.linear().domain([0.5, 8.5]).range([height, 0]),
    radiusScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]),
    colorScale = d3.scale.category10();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var  regionname=["South Asia","Europe & Central Asia","Middle East & North Africa","East Asia & Pacific","Sub-Saharan Africa","America"];


// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Add an x-axis label.
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("income per capita, inflation-adjusted (dollars)");

// Add a y-axis label.
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Fertility Rate per woman");

// Add the year label; the value is set on transition.
var label = svg.append("text")
    .attr("class", "year label")
    .attr("text-anchor", "end")
    .attr("y", height - 306)
    .attr("x", width)
    .text(1961);

var g1=svg.append("g");

// Load the data.
var showRoute= function () {
    console.log(this.id);
    d3.selectAll(".route" + this.id)
        .classed("hide",false)
    d3.selectAll(".dot")
        .classed("fade",true);
};
var hideRoute= function () {
    d3.selectAll(".route" + this.id)
        .classed("hide",true)
    d3.selectAll(".dot")
        .classed("fade",false);
};



// Load the data.
d3.json("nations.json", function(nations) {

    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function(d) { return d[0]; });

    // Add a dot per nation. Initialize the data at 1961, and set the colors.
    var dot = svg.append("g")
        .selectAll(".dot")
        .data(interpolateData(1961))
        .enter()
        .append("circle")
        .attr("id", function (d,i) {
            return i;
        })
        .classed("dot",true)
        .style("fill", function(d) { return colorScale(color(d)); })
        .call(position)
        .on("mouseover",showRoute)
       // .on("mouseover",hid())
        .on("mouseout",hideRoute)
    .sort(order);


    // Add a title.
    dot.append("title")
        .text(function(d) { return d.name + ", "+d.region; });


    //Add a legend
    var legend = svg.append("g")
        .selectAll(".legend")
        .data(regionname)
        .enter().append("rect")
        .attr("x", 900)
        .attr("y",function(d,i){return 185+(i++)*30;})
        .attr("width",20)
        .attr("height",12)
        .style("fill", function(d) { return colorScale(d); })
       // .append("title")
       // .text(function(d){return d;});

    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("x", box.x)
        .attr("y", box.y)
        .attr("width", box.width)
        .attr("height", box.height)
        .on("mouseover", enableInteraction);

    // Start a transition that interpolates the data based on year.
    svg.transition()
    //dot.transition()
        .duration(20000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);

    // Positions the dots based on data.
    function position(dot) {
        dot .attr("cx", function(d) { return xScale(x(d)); })
            .attr("cy", function(d) { return yScale(y(d)); })
            .attr("r", function(d) { return radiusScale(radius(d)); });
    }


    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    // After the transition finishes, you can mouseover to change the year.
    function enableInteraction() {
        var yearScale = d3.scale.linear()
            .domain([1961, 2012])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);

        // Cancel the current transition, if any.
        svg.transition().duration(0);
        //dot.transition().duration(0);

        overlay
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .on("touchmove", mousemove);

        function mouseover() {
            label.classed("active", true);
        }

        function mouseout() {
            label.classed("active", false);
        }

        function mousemove() {
            displayYear(yearScale.invert(d3.mouse(this)[0]));
        }
    }

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
        var year = d3.interpolateNumber(1961, 2012);
        return function(t) { displayYear(year(t)); };
    }
    // Updates the display to show the specified year.
    function displayYear(year) {
        dot.data(interpolateData(year), key)
            .call(function (d) {
                //console.log(d[0]);
                for(i=0;i< d[0].length;i++){
                    console.log(d[0][i].style.fill);
                    g1.append("ellipse")
                        .classed("hide",true)
                        .classed("route" + i,true)
                        .attr("cx", d[0][i].cx.baseVal.value)
                        .attr("cy", d[0][i].cy.baseVal.value)
                        .attr("rx", d[0][i].r.baseVal.value)
                        .attr("ry", d[0][i].r.baseVal.value)
                        .attr("stroke","none")
                        .attr("fill",d[0][i].style.fill);

                }

                //console.log(d[0][3].r.baseVal.value);
                position(d);
            })
            .sort(order);
        //console.log("wow");
        label.text(Math.round(year));
    }

    // Interpolates the dataset for the given (fractional) year.
    function interpolateData(year) {
        return nations.map(function(d) {
            return {
                name: d.name,
                region: d.region,
                income: interpolateValues(d.income, year),
                population: interpolateValues(d.population, year),
                fertility: interpolateValues(d.fertility, year)
            };
        });
    }

    // Finds (and possibly interpolates) the value for the specified year.
    function interpolateValues(values, year) {
        var i = bisect.left(values, year, 0, values.length - 1),
            a = values[i];
        if (i > 0) {
            var b = values[i - 1],
                t = (year - a[0]) / (b[0] - a[0]);
            return a[1] * (1 - t) + b[1] * t;
        }
        return a[1];
    }
});

/*<span id="content">legend</span>

document.getElementById('content').innerHTML='S'*/

GoogleAnalyticsObject = "ga", ga = function() { ga.q.push(arguments); }, ga.q = [], ga.l = +new Date;
ga("create", "UA-48272912-3", "ocks.org");
ga("send", "pageview");

