/**
 * Created by panzg on 14-11-16.
 */
var width  = 1000;
var height = 820;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(850)
    .translate([width/2, height/2]);

var path = d3.geo.path()
    .projection(projection);


//颜色比例尺
var color = d3.scale.category20();


d3.json("china.json", function(error, root) {

    if (error)
        return console.error(error);
    console.log(root);

    svg.selectAll(".proLine")
        .data( root.features )
        .enter()
        .append("path")
        .attr("class","proLine")
        .attr("stroke","#000")
        .attr("stroke-width",1)
        .attr("fill", funColor)
        .attr("d", path );

    var testPath =svg.selectAll(".proText")
        .append("text")
        .attr("class","proText")
        .attr("dx",function(d){return -20})
        .text(function(d){return d.properties.name});
    console.log(testPath);

    svg.append("rect") .attr("x","950").attr("y","500").attr("width","30") .attr("height","10") .attr("fill","#00DD00");
    svg.append("rect") .attr("x","950").attr("y","490").attr("width","30") .attr("height","10") .attr("fill","#CCFF99");
    svg.append("rect") .attr("x","950").attr("y","480").attr("width","30") .attr("height","10") .attr("fill","#FFFF00");
    svg.append("rect") .attr("x","950").attr("y","470").attr("width","30") .attr("height","10") .attr("fill","#E63F00");
    svg.append("rect") .attr("x","950").attr("y","450").attr("width","30") .attr("height","20") .attr("fill","#FF0000");
    svg.append("rect") .attr("x","950").attr("y","410").attr("width","30") .attr("height","40") .attr("fill","#0044BB");
    svg.append("text").attr("x","850").attr("y","430").text("300-500,严重");
    svg.append("text").attr("x","850").attr("y","450").text("200-300,重度");
    svg.append("text").attr("x","850").attr("y","470").text("150-200,中度");
    svg.append("text").attr("x","850").attr("y","490").text("100-150,轻度");
    svg.append("text").attr("x","850").attr("y","500").text("50-100,良");
    svg.append("text").attr("x","850").attr("y","520").text("0-50，优");
    update();
});



function funColor(d,i){
    return color(i);
    //      console.log(d);
}
function AutoPlay(){
    var selectedIndex = document.getElementById("dateSelector");
    var j=0;
    d3.timer(function(){
        selectedIndex.selectedIndex = j;
        j++;
        update();
        if(j==10) return true;
    },-2000,Date.now());

    // selectedIndex.selectedIndex = 0;
}
function sleep(milisecond) {
    var currentDate, beginDate = new Date();
    var beginHour, beginMinute, beginSecond, beginMs;
    var hourGaps, minuteGaps, secondGaps, msGaps, gaps;
    beginHour = beginDate.getHours();
    beginMinute = beginDate.getMinutes();
    beginSecond = beginDate.getSeconds();
    beginMs = beginDate.getMilliseconds();
    do {

        currentDate = new Date();
        hourGaps = currentDate.getHours() - beginHour;
        minuteGaps = currentDate.getMinutes() - beginMinute;
        secondGaps = currentDate.getSeconds() - beginSecond;
        msGaps = currentDate.getMilliseconds() - beginMs;
        if (hourGaps < 0) hourGaps += 24;   //考虑进时进分进秒的特殊情况
        gaps = hourGaps * 3600 + minuteGaps * 60 + secondGaps;
        gaps = gaps * 1000 + msGaps;
    } while (gaps < milisecond);

}
function update(){
    d3.json("data.json",function(root){

        var selectedIndex = document.getElementById("dateSelector");
        var selectedValue = selectedIndex.options[selectedIndex.selectedIndex].getAttribute("value");

        console.log(root);
        var aqidata = new Array();
        for(var i=0;i<root.data.length;i++)
            aqidata.push(root.data[i].AQI);
        //          console.log(aqidata);
        var paths = svg.selectAll("path");



        var scale = d3.scale.linear()
            .domain([d3.min(aqidata),d3.max(aqidata)])
            .range([0,1]);


        svg.selectAll("path")
            .append("title")
            .text(function(d){ return d.properties.name+"\nAQI:"+aqidata[d.properties.id-1][selectedValue-1];});
        //          console.log(paths);

        paths .attr("fill",function(d){

            var res =aqidata[d.properties.id-1][selectedValue-1];
            /*
             0-50 1级 优	参加户外活动呼吸清新空气
             50-100  2级 良	可以正常进行室外活动
             101-150  3级 轻度	敏感人群减少体力消耗大的户外活动
             151-200 4级 中度	对敏感人群影响较大
             201-300  5级 重度	所有人应适当减少室外活动
             >300  6级 严重	尽量不要留在室外
             */
            if(res < 50 ) return  "#00DD00";
            else if (res>50 && res <100) return "#CCFF99";
            else if(res >100 && res <150 ) return "#FFFF00";
            else if(res >150 && res <200) return "#E63F00";
            else if(res >200 && res <300) return "#FF0000";
            else return "#0044BB";

        });

    });
}