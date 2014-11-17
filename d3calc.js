/*****Created by gjy on 2014/11/1.*****/

var teams=["Bucks","Bulls","Cavaliers","Celtics","Clippers","Grizzlies","Hawks","Heat","Hornets","Jazz","Kings","Knicks","Lakers","Magic","Mavericks","Nets","Nuggets","Pacers","Pelicans","Pistons","Raptors","Rockets","Seventysixers","Spurs","Suns","Thunder","Timberwolves","Trailblazers","Warriors","Wizards"];
var orderTeams=["Bucks","Bulls","Cavaliers","Celtics","Clippers","Grizzlies","Hawks","Heat","Hornets","Jazz","Kings","Knicks","Lakers","Magic","Mavericks","Nets","Nuggets","Pacers","Pelicans","Pistons","Raptors","Rockets","Seventysixers","Spurs","Suns","Thunder","Timberwolves","Trailblazers","Warriors","Wizards"];
var score=[ 100,100,100,100,100,
            100,100,100,100,100,
            100,100,100,100,100,
            100,100,100,100,100,
            100,100,100,100,100,
            100,100,100,100,100];
var teamX=[ 829, 829, 1001, 1210, 172, 896, 1005, 1075, 1077, 338, 191, 1133, 219, 999, 596,
    1158, 486, 918, 830, 940, 956, 726, 1100, 597, 394, 681, 624, 264, 123, 1098];
var teamY=[ 208, 327, 331, 150, 427, 462, 541, 675, 436, 338, 290, 190, 412, 596, 518,
    271, 312, 330, 567, 239, 58, 601, 274, 621, 499, 394, 154, 165, 280, 335];
var teamOrder=[ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
                17,18,19,20,21,22,23,24,25,26,27,28,29];
//var color=d3.scale.category10();
var color= function (d) {
    switch (d%10){
        case 1:
            return "#a6cee3";
            break;
        case 2:
            return "#1f77b4";
            break;
        case 3:
            return "#b2df8a";
            break;
        case 4:
            return "#33a02c";
            break;
        case 5:
            return "#fb9a99";
            break;
        case 6:
            return "#e31a1c";
            break;
        case 7:
            return "#fdbf6f";
            break;
        case 8:
            return "#ff7f00";
            break;
        case 9:
            return "#cab2d6";
            break;
        case 0:
            return "#6a3d9a";
            break;
        default :
            return "lightgrey";
            break;
    }
};
var winData=[   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var loseData=[  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var barWidth=[  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var w = 1366;
var h = 768;

var x = d3.scale.ordinal().domain(teams).range(teamX);
var y = d3.scale.ordinal().domain(teams).range(teamY);

//window.onclick= function (aEvent) {
//    console.log(aEvent.x + "," + aEvent.y);
//    aEvent.preventDefault();
//};

var svg = d3.select("#plots").append("svg")
    .attr("id","svgPlot")
    .attr("viewBox","0 0 1366 768")
    .attr("preserveAspectRatio","none meet")
    .attr("width", "100%")
    .attr("height", "100%");
var gFront=svg.append("g");
var gFronter=svg.append("g");

var twoSides=["team", "opp"];
var teamLoc=gFronter.selectAll("circle")
    .data(teams)
    .enter()
    .append("circle")
    .classed("locCircles",true)
    .on("mousemove",locHighlight)
    .on("mouseout",locDehighlight)
    .on("click",locClick)
    //.attr("r","25")
    .attr("cx",function (d) {
        return(x(d));
    })
    .attr("cy",function (d,i) {
        return(y(d));
    })
    .attr("fill","yellow")
    .attr("opacity",.3)
    .attr("stroke","transparent")
    .attr("stroke-width","1")
    .attr("id", function (d) {
        return "teamLoc"+ d;
    });

var line = d3.svg.line();
function path(d) {
    return line(twoSides.map(function (p) {
        return [x(d[p]), y(d[p])];
    }));
}
function pos(d) {
    return twoSides.map(function (p) {
        return [x(d[p]), y(d[p])];
    });
}

var barSvg=d3.select("#barChart")
    .append("svg")
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","0 0 125 300")
    .attr("preserveAspectRatio","none meet");
var linkSvg=d3.select("#linkPlot")
    .selectAll("svg")
    .data(teams)
    .enter()
    .append("svg")
    .classed("hide",true)
    .style({"position":"fixed","left":"0","top":"0"})
    .attr("id",function(d){
        //console.log("link" + d);
        return "link" + d;
    })
    .attr("width","100%")
    .attr("height","100%")
    .attr("viewBox","0 0 1366 768")
    .attr("preserveAspectRatio","none meet");

d3.csv("NBA2013_new_0.csv", function(nba) {
    var $teamRadius=20;
    var $constTime=600;
    document.getElementById("rangeBar").value=$constTime;
    var teamWonOrLose= 0, oppWonOrLose= 0;
    foreground = gFront.attr("class", "foreground");
    var $i=0,i=0;
    var t0=Date.now();
    var t1=Date.now();
    var loop=0;

    var date=[];
    var win=[],team=[],opp=[];
    var xFrom=[],xTo=[],yFrom=[],yTo=[];
    var deltaX=[],deltaY=[];
    var m0=[],m1=[];
    var count=0;

    var delta=0;
    var tmpDelta=0;


    count=nba[loop].count;
    for(i=0;i<count;i++){
        date.push(nba[loop].date);
        win.push(+nba[loop].win);
        team.push(nba[loop].team);
        opp.push(nba[loop].opp);
        xFrom.push(x(opp[i]));
        yFrom.push(y(opp[i]));
        xTo.push(x(team[i]));
        yTo.push(y(team[i]));
        deltaX.push((xTo[i]-xFrom[i])/$constTime);
        deltaY.push((yTo[i]-yFrom[i])/$constTime);
        m0.push(xFrom[i]);
        m1.push(yFrom[i]);

        var tmpStrLinkTeam="#link" + nba[loop].team;
        var tmpStrLinkOpp="#link" + nba[loop].opp;
        var tmpLinkPath=line([[x(nba[loop].team),y(nba[loop].team)],[x(nba[loop].opp),y(nba[loop].opp)]]);
        d3.select(tmpStrLinkTeam)
            .append("path")
            .attr("d",tmpLinkPath)
            .classed("home",true)
            .attr("stroke-width","2")
            .attr("stroke","red")
            .attr("stroke-opacity",".6")
            .attr("fill","none");
        d3.select(tmpStrLinkOpp)
            .append("path")
            .attr("d",tmpLinkPath)
            .classed("guest",true)
            .attr("stroke-width","2")
            .attr("stroke-opacity",".6")
            .attr("stroke","blue")
            .attr("fill","none");

        var indTeam=teams.indexOf(nba[loop].team);
        var indOpp=teams.indexOf(nba[loop].opp);
        if((+nba[loop].win)==1){
            winData[indTeam]+=1;
            loseData[indOpp]+=1;
        }
        else{
            winData[indOpp]+=1;
            loseData[indTeam]+=1;
        }
        teamWonOrLose=winData[indTeam]-loseData[indTeam];
        oppWonOrLose=winData[indOpp]-loseData[indOpp];
        d3.select("#teamLoc"+nba[loop].team)
            .classed("wonMore",teamWonOrLose>0)
            .classed("loseMore",teamWonOrLose<=0)
            .transition()
            .delay($constTime *.8)
            .attr("r", function () {
                return Math.abs(2*teamWonOrLose);
            });

        d3.select("#teamLoc"+nba[loop].opp)
            .classed("wonMore",oppWonOrLose>0)
            .classed("loseMore",oppWonOrLose<=0)
            .attr("r", function () {
                return Math.abs(2*oppWonOrLose);
            });


        barWidth[indTeam]=120*winData[indTeam]/(winData[indTeam]+loseData[indTeam]);
        barWidth[indOpp]=120*winData[indOpp]/(winData[indOpp]+loseData[indOpp]);

        barSvg
            .attr("id","barSvg")
            .selectAll("rect")
            .data(barWidth)
            .enter()
            .append("rect")
            .classed("barChartRects",true)
            .attr("id", function (d,i) {
                return orderTeams[i];
            })
            .attr("x", 0)
            .attr("y", function(d,u) {
                //return teamOrder[u]*10;
                return u*10;
            })
            .attr("width", function (d) {
                return d;
            })
            .attr("height", 10)
            .attr("fill", function (d,u) {
                return color(u);
            })
            .on("mousemove",showToolTip)
            .on("mouseout", hideToolTip);
        loop++;
    }

    d3.timer(function () {
        var K=1/$constTime*0.5*Math.PI;
        if(tmpDelta<1000){
            t0=Date.now();
            tmpDelta=t0-t1;
        }
        else{
            delta=Date.now()-t0;
            if(delta>$constTime){
                $constTime = +document.getElementById("rangeBar").value;
                if(loop==nba.length){
                    var str="The Final Winner: " + (win?team:opp) +"  The Opponent: " +  (win?opp:team);
                    alert(str);
                    loop++;
                    //foreground.selectAll("circle").remove();
                    }
                else{
                    if(loop<=710 && loop >=700){
                        document.getElementById("rangeBar").value=1800;
                    }
                    delta=-1;
                    t0=Date.now();
                    count=nba[loop].count;
                    date=[];
                    win=[];team=[];opp=[];
                    xFrom=[];xTo=[];yFrom=[];yTo=[];
                    deltaX=[];deltaY=[];
                    m0=[];m1=[];
                    for(i=0;i<count;i++){
                        date.push(nba[loop].date);
                        win.push(+nba[loop].win);
                        team.push(nba[loop].team);
                        opp.push(nba[loop].opp);
                        xFrom.push(x(opp[i]));
                        yFrom.push(y(opp[i]));
                        xTo.push(x(team[i]));
                        yTo.push(y(team[i]));
                        deltaX.push((xTo[i]-xFrom[i])/$constTime);
                        deltaY.push((yTo[i]-yFrom[i])/$constTime);
                        m0.push(xFrom[i]);
                        m1.push(yFrom[i]);

                        var tmpStrLinkTeam="#link" + nba[loop].team;
                        var tmpStrLinkOpp="#link" + nba[loop].opp;
                        var tmpLinkPath=line([[x(nba[loop].team),y(nba[loop].team)],[x(nba[loop].opp),y(nba[loop].opp)]]);
                        console.log(tmpLinkPath);
                        d3.select(tmpStrLinkTeam)
                            .append("path")
                            .attr("d",tmpLinkPath)
                            .classed("home",true)
                            .attr("stroke-width","2")
                            .attr("stroke-opacity",".6")
                            .attr("stroke","red");
                        d3.select(tmpStrLinkOpp)
                            .append("path")
                            .attr("d",tmpLinkPath)
                            .classed("guest",true)
                            .attr("stroke-width","2")
                            .attr("stroke-opacity",".6")
                            .attr("stroke","blue");

                        var indTeam=teams.indexOf(nba[loop].team);
                        var indOpp =teams.indexOf(nba[loop].opp);
                        if((+nba[loop].win)==1){
                            winData[indTeam]+=1;
                            loseData[indOpp]+=1;
                        }
                        else{
                            winData[indOpp]+=1;
                            loseData[indTeam]+=1;
                        }

                        teamWonOrLose=winData[indTeam]-loseData[indTeam];
                        oppWonOrLose=winData[indOpp]-loseData[indOpp];
                        d3.select("#teamLoc"+nba[loop].team)
                            .classed("wonMore",teamWonOrLose>0)
                            .classed("loseMore",teamWonOrLose<=0)
                            .transition()
                            .delay($constTime *.8)
                            .attr("r", function () {
                                return Math.abs(2*teamWonOrLose);
                            });
                        d3.select("#teamLoc"+nba[loop].opp)
                            .classed("wonMore",oppWonOrLose>0)
                            .classed("loseMore",oppWonOrLose<=0)
                            .attr("r", function () {
                                return Math.abs(2*oppWonOrLose);
                            });
                        //foreground.selectAll("circle").transition().duration($constTime *.5).remove();
                        barWidth[indTeam]=120*winData[indTeam]/(winData[indTeam]+loseData[indTeam]);
                        barWidth[indOpp]=120*winData[indOpp]/(winData[indOpp]+loseData[indOpp]);
                        //barSvg.selectAll("rect").remove();

                        var loop_i,loop_j,loop_k,loop_l,loop_m;
                        var teamLocOrder=[  0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
                                            17,18,19,20,21,22,23,24,25,26,27,28,29];
                        var tmpWinData=[];
                        for(loop_k=0;loop_k<winData.length;loop_k++){
                            tmpWinData.push(winData[loop_k]);
                        }


                        for(loop_i=0;loop_i<teamLocOrder.length-1;loop_i++){
                            for(loop_j=loop_i+1;loop_j<teamLocOrder.length;loop_j++){
                                if(tmpWinData[loop_i]<tmpWinData[loop_j]){
                                    var tmp1=tmpWinData[loop_i];
                                    tmpWinData[loop_i]=tmpWinData[loop_j];
                                    tmpWinData[loop_j]=tmp1;
                                    var tmp2=teamLocOrder[loop_i];
                                    teamLocOrder[loop_i]=teamLocOrder[loop_j];
                                    teamLocOrder[loop_j]=tmp2;
                                }
                            }
                        }

                        //barSvg
                        //    .selectAll("rect")
                        //    .data(barWidth)
                        //    .attr("y", function (d,i) {
                        //        //console.log(teamOrder[i]);
                        //        return teamLocOrder[i] * 10;
                        //    })
                        //    .attr("width", function (d) {
                        //        return d+5;
                        //    });

                        barSvg
                            .selectAll("rect")
                            .data(barWidth)
                            .attr("y", function(d,u) {
                                //return teamOrder[u]*10;
                                return (teamLocOrder.indexOf(u))*10;
                            })
                            .transition()
                            .duration(Math.floor($constTime *.5))
                            .attr("width", function (d) {
                                return d+5;
                            });
                        K=1/$constTime*0.5*Math.PI;
                        loop++;

                    }
                }
            }
            else{
                for(i=0;i<count;i++) {
                    //m0[i] = xFrom[i] + delta * deltaX[i];
                    //m1[i] = yFrom[i] + delta * deltaY[i];
                    //m0[i] = xFrom[i] + (xTo[i]-xFrom[i])*(1 - Math.cos(delta/$constTime*0.5*Math.PI));
                    m0[i] = xFrom[i] + (xTo[i]-xFrom[i])* 0.5 * (1 - Math.cos(delta/$constTime*Math.PI));
                    m1[i] = yFrom[i] + (yTo[i]-yFrom[i]) / Math.PI * (Math.PI - Math.acos(delta/$constTime));
                    //m1[i] = yFrom[i] + (yTo[i]-yFrom[i])*( Math.sin(delta*K));



                    d3.select("#labDate").text("Date:" + date[i]);
                    //d3.select("#labHome").text("Home:"+ team);
                    //d3.select("#labGuest").text("Guest:"+ opp);

                    foreground.append("circle")
                        //.attr("class", function () {
                        //    return win ? "won" : "lost";
                        //})
                        //.attr("fill", function () {
                        //    if(win[i]){
                        //        return color(teams.indexOf(team[i]));
                        //    }
                        //    else{
                        //        return "#111111";
                        //    }
                        //})
                        .attr("fill", function () {
                            if(win[i]){
                                return "url(#brush0" + (i%10) +")";
                            }
                            else{
                                return "url(#brushLose)";
                            }
                            //return "url(#brush01)";
                        })
                        .attr("cx", m0[i])
                        .attr("cy", m1[i])
                        .attr("r", 40)
                        //.style("stroke", d3.hsl(($i = ($i + 1) % 360), 1, .5))
                        .transition()
                        //.duration($constTime*1.2)
                        .duration($constTime *.8)
                        //.ease(foo)
                        .ease("linear")
                        //.attr("r", 1)
                        .style("opacity",.01)
                        .remove();
                    foreground.append("line")
                        //.attr("stroke", function () {
                        //    if(win[i]){
                        //        return "url(#brush0" + (i%10) +")";
                        //    }
                        //    else{
                        //        return "url(#brushLose)";
                        //    }
                        //    //return "url(#brush01)";
                        //})
                        .attr("stroke", function () {
                            if(win[i]){
                                return color(i);
                            }
                            else{
                                return "darkgrey";
                            }
                            //return "url(#brush01)";
                        })
                        .attr("stroke-opacity",.8)
                        .attr("x1",xFrom[i])
                        .attr("y1",yFrom[i])
                        .attr("x2", m0[i])
                        .attr("y2", m1[i])
                        .attr("stroke-width", 1)
                        //.style("stroke", d3.hsl(($i = ($i + 1) % 360), 1, .5))
                        .transition()
                        .duration($constTime *.2)
                        //.ease(foo)
                        //.attr("r", 1)
                        .remove();
                }
            }
        }
    });
});

function foo(d){
    //if(d>0.01){
    //    return 0.975;
    //}
    //else{
    //    return 0;
    //}
    //return Math.log(Math.sqrt(d)/2+1);
    return 1;
}

function showToolTip(aEvent){
    d3.select("#toolTip").classed("hide",false);
    var sel = document.getElementById("barChart");
    var m= d3.mouse(sel);
    var str="#teamLoc" + this.id;
    //var str="body";
    d3.select(str).classed("highlighted",true);
    d3.select("#"+this.id).classed("highlighted",true);
    //d3.select(str).classed("hide",true);
    var ind = teams.indexOf(this.id);
    d3.select("#toolTipLabel")
        .text(this.id + "\nWinRate:" + winData[ind]/(winData[ind]+loseData[ind]) + "\nWins:  " + winData[ind] + "\nLoses:  " + loseData[ind])
        .attr("style","top:0;left:0");
    //d3.select("#toolTip").attr("style","top:"+m[1]+"px;left:" + m[0] + "px");
    d3.select("#toolTip").attr("style","top:"+ (m[1] + 5) +"px;left:" + (m[0] + 10) + "px");
    //console.log("x:  y:  ");
    //console.log(m[0]);
    //console.log(m[1]);
    //aEvent.preventDefault();
}

function hideToolTip() {
    var str="#teamLoc" + this.id ;
    //console.log(str);
    d3.select("#toolTip").classed("hide",true);
    d3.select(str).classed("highlighted",false);
    d3.select("#"+this.id).classed("highlighted",false);
    //alert("wow");
}

function locHighlight() {
    d3.select("#locTip").classed("hide",false);
    d3.select("#" + this.id).classed("highlighted",true);
    d3.select("#" + this.id.substr(7)).classed("highlighted",true);
    console.log(this.id.substr(7));
    var sel = document.getElementById("plots");
    var m= d3.mouse(sel);
    //d3.select(str).classed("hide",true);
    var ind = teams.indexOf(this.id.substr(7));
    d3.select("#locTipLabel")
        .text(this.id.substr(7) + "\nWinRate:" + winData[ind]/(winData[ind]+loseData[ind]) + "\nWins:  " + winData[ind] + "\nLoses:  " + loseData[ind])
        .attr("style","top:0;left:0");
    //d3.select("#toolTip").attr("style","top:"+m[1]+"px;left:" + m[0] + "px");
    d3.select("#locTip").attr("style","top:"+ (m[1] + 5) +"px;left:" + (m[0] + 10) + "px");
    d3.select("#link" + this.id.substr(7)).classed("hide",false);
}
function locDehighlight(){
    d3.select("#" + this.id).classed("highlighted",false);
    d3.select("#" + this.id.substr(7)).classed("highlighted",false);
    d3.select("#locTip").classed("hide",true);
    d3.select("#link" + this.id.substr(7)).classed("hide",true);
}
function locClick(){
    d3.select("#link" + this.id.substr(7)).classed("hide",false);
}