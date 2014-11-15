/**
 * @name    core.js
 * @author  OshynSong
 */

String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

var datafile = "./data/ChampionsStatistics.csv";

var types = [
	'Mage',     //法师
	'Marksman', //ADC
	'Assassin', //刺客
	'Support',  //辅助
	'Tank',     //坦克
	'Fighter'   //战士
],
	traits = [
	"Popularity", //出场率
	"WinRatio",   //胜率
	"KDARatio",   //KDA率
	"KDRatio",    //KD率
	"AvgKills",   //平均击杀
	"AvgDeaths",  //平均死亡
	"AvgAssists"  //平均助攻
]
	ranges = [
	[0, 0.33],
	[0.2, 0.65],
	[1.6, 4.0],
	[0.2, 1.8],
	[1, 12],
	[4, 9],
	[5, 16]
];

var m = [80, 160, 200, 160],
		w = 1280 - m[1] - m[3],
		h = 800 - m[0] - m[2];

var x = d3.scale.ordinal().domain(traits).rangePoints([0, w]),
	y = {};

var line = d3.svg.line(),
	axis = d3.svg.axis().orient("left"),
	foreground;

var svg = d3.select("#div-chart").append("svg:svg")
		.attr("width", w + m[1] + m[3])
		.attr("height", 650)
		.append("svg:g")
		.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var Drawing = function(champions) {
		var i = 0;
		traits.forEach(function(d){
			y[d] = d3.scale.linear()
					.domain([ranges[i][0], ranges[i][1]])
					.range([h, 0]);
			i++;
			
			y[d].brush = d3.svg.brush()
					.y(y[d])
					.on("brush", brush);
		});
		foreground = svg.append("svg:g")
			.attr("class", "foreground")
			.selectAll("path")
			.data(champions)
			.enter().append("svg:path")
			.attr("d", path)
			.attr("class", function(d) { return d.Primary; });
		
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

		g.append("svg:g")
				.attr("class", "axis")
				.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
				.append("svg:text")
				.attr("text-anchor", "middle")
				.attr("y", -9)
				.text(String);

		g.append("svg:g")
				.attr("class", "brush")
				.each(function(d) { d3.select(this).call(y[d].brush); })
				.selectAll("rect")
				.attr("x", -8)
				.attr("width", 16);

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
};

var update = function (file){
	d3.csv(file, function(champions) {
		Drawing(champions);
	});
}

var path = function(d) {
	return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
}

var brush = function() {
	var actives = traits.filter(function(p) { return !y[p].brush.empty(); }),
			extents = actives.map(function(p) { return y[p].brush.extent(); });
	foreground.classed("fade", function(d) {
		return !actives.every(function(p, i) {
			return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		});
	});
}


/*******************************
 * The interaction in the page *
 *******************************/
var legendLoad = function(){
	var target = $(this).attr("data-target");
	target = target.substr(1);
	var mb = $("#" + target + " .modal-body");
	mb.children().remove();
	d3.csv(datafile, function(champions) {
		for(var i in champions){
			if (champions[i].Primary == target){
				var html = '<div class="modalDiv">';
				html += '<label><input class="item" type="checkbox" value="' + champions[i].Champion;
				html += '">&nbsp;&nbsp;<img src="./images/';
				html += champions[i].Champion + '.png">&nbsp;&nbsp;<span class="t">';
				html += champions[i].Champion + '</span></label></div>';
				mb.append(html);
			}
		}
	});
};

var drawLine = function(){
	//Close the select all
	$(this).prev().prev().find("input").attr("checked", false);
	
	var mb = $(this).parentsUntil(".modal").find(".modal-body");
	var selected = new Array();
	var inputs = mb.find(".modalDiv .item");
	
	for(var i in inputs){
		if (inputs[i]["checked"]){
			var s = inputs[i]['value'];
			s = s.trim();
			selected.push(s);
		}
	}
	delSvgG();
	var selecteddata = [];
	d3.csv(datafile, function(champions) {
		var a = 0;
		for (var i in champions){
			e = false;
			for (var j in selected){
				if (champions[i].Champion.trim() == selected[j]){
					e = true;
				}
			}
			if (e) selecteddata.push(champions[i]);
		}
		Drawing(selecteddata);
	});
	$(this).prev().trigger("click");
};
var delSvgG = function(){
	$("#div-chart").find("svg > g").children().remove();
};

$(".rectDiv").bind("click", legendLoad);
$(".btnDraw").bind("click", drawLine);

