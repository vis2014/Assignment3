var result = ["tested_positive", "tested_negative"],
    items = ["preg", "plas", "pres", "skin","insu","mass","pedi","age"];   //观测指标

var m = [80, 160, 200, 160],
    w = 1280 - m[1] - m[3],    //左右各留出160,上面留出80,下面留出200
    h = 800 - m[0] - m[2];    //1280,800是屏幕的比例，在这里也设置成了svg的宽和高，w和h是坐标轴画布的范围

var x = d3.scale.ordinal().domain(items).rangePoints([0, w]),//生成序数比例尺，并将坐标轴画布的横轴分成四部分，sepal length对应第一部分，依次类推
    y = {};              //同时产生y轴对象

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    foreground;                                           //生成数轴

var svg = d3.select("body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])                    //生成svg元素
    .append("svg:g")                                      //g标签其实就是坐标轴画布的范围
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");    //插入分组元素并将其中的元素平移,右移m[3],下移m[0]
d3.csv("../Data/diabetes.csv", function(observer) {                              //加载数据，每一行数据都是一个observer


    items.forEach(function(d) {

        observer.forEach(function(p) { p[d] = +p[d]; });

        y[d] = d3.scale.linear()                          //把每一个属性对应到一个线性比例尺上
            .domain(d3.extent(observer, function(p) { return p[d]; }))//每一列建线性比例尺   d3.extent表示从数组里选出最大值和最小值
            .range([h, 0]);                               //线性比例尺的输出范围是h到0，这是绝对位置

        y[d].brush = d3.svg.brush()                       //对每一列建刷子
            .y(y[d])
            .on("brush", brush);
    });

    //       增加一个图例
    var legend = svg.selectAll("g.legend")
        .data(result)
        .enter().append("svg:g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });
    legend.append("svg:line")
        .attr("class", String)
        .attr("x2", 8);//输出图例彩线

    legend.append("svg:text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(function(d) { return  d; })  //输出图例字符串
        .on("click",function(d){
            foreground.style("stroke-width",0);
            foreground.filter(function(p){          //对线进行过滤，只显示某一种结果的线
                return d== p.result;
            })
                .attr("class",function(d){return(d.result);})
                .style("stroke-width","1")
            legend
                .on("mouseout",function(){

                    foreground.attr("class",function(d){return d.result;})
                        .style("stroke-width",1);
                });
        });


    //  画出所有的线，可以在这里修改，对线进行过滤之类的
    foreground = svg.append("svg:g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(observer)                      //每一个path代表一行属性数据值
        .enter().append("svg:path")
        .attr("d", path)
        .attr("class", function(d) { return d.result; })    //设置颜色，对应上面的css设置，不同的类别设置不同的颜色

    /*  foreground           //选择一条路径，有bug
     .on("mouseover",function(d){
     foreground.filter(function(p){
     return d==p;
     })
     .attr("class","selected")
     .style("stroke-width","6");
     foreground.filter(function(p){
     return d!=p;
     })
     .style("stroke-width","0");

     })
     .on("mouseout",function(d){
     foreground
     .attr("class",function(d){return d.result;})
     .style("stroke-width","1");
     });*/

    //        为每一个特征增加一组元素
    var g = svg.selectAll(".item")
        .data(items)
        .enter().append("svg:g")
        .attr("class", "item")
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
        i = items.indexOf(d);        //设置开始拖动的坐标
    }

    function drag(d) {
        x.range()[i] = d3.event.x;
        items.sort(function(a, b) { return x(a) - x(b); });
        g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        foreground.attr("d", path);
    }

    function dragend(d) {
        x.domain(items).rangePoints([0, w]);
        var t = d3.transition().duration(500);
        t.selectAll(".item").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        t.selectAll(".foreground path").attr("d", path);
    }
});


function path(d) {            //d代表每一行的数据
    return line(items.map(function(p) { return [x(p), y[p](d[p])]; }));    //p取1,2,3,4
}


function brush() {
    var actives = items.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.classed("fade", function(d) {        //刷子刷上的变为fade
        return !actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        });
    });


}
