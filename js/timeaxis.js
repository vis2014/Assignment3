//画坐标轴
	function drawAxisTime(svg, w, h, data) {
		
		//var data = ["1995", "1996", "1997"];
		var padding = 100;
		var axisw  = w - 2*padding;
		var axish = h*0.75;
		


		var svgTimeAxis = svg.append("g")//在body的结尾添加svg
			    .attr("class", "axis") // 指定"axis" 类;
					
		//画坐标线<line x1="0" y1="0" x2="500" y2="50" stroke="black"/>
		svgTimeAxis.append("line")
				   .attr("x1", padding)
				   .attr("y1", axish)
				   .attr("x2", axisw+padding)
				   .attr("y2", axish)
				   .attr("stroke", "black");


		//设置坐标轴的比例尺
		var length = data.length;
		//序数坐标比例尺
		var xScale = d3.scale.linear()
				.domain([0, length-1])
				.range([padding, axisw+padding]);

		var r = 5;

		//画原点
		var circles = svgTimeAxis.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("id", function(d){
				return d;
			})
			.style("fill", function(d, i) {
				return "#63B8FF";
			});

			circles.attr("cx", function(d, i) {
				return xScale(i);
			})
			.on("click", function(d){
				//var year = this.id;
				circlemouseover(d, this);	
			})
			.attr("cy", axish)
			.attr("r", r);

		//画坐标值 <text x="250" y="25">Easy-peasy</text>
		var texts = svgTimeAxis.selectAll("text")
			.data(data)
			.enter()
			.append("text")
			.text(function(d, i){
				return d;
			})
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", axish+30)
			.attr("text-anchor", "middle");//文本居中
	}

	//坐标轴原点时间
	function circlemouseover(year, t){
		//现将所有的圆的坐标回复成原大小
		d3.selectAll(".circle")
		  .attr("r", 5)
		  .style("fill", "#63B8FF")
		//一下代码是将坐标轴上的圆变大
		if(t != undefined) {
			var circle = d3.select(t);
			circle.transition()
	  			.duration(750)
	  			.attr("r", function(d){  //设置圆点半径                      
						return 5+5;                          
					}).style("fill", "#C0FF3E");
	  	}
  		
  		//var jsonpath = "json/" +this.id + ".json";
  		var jsonpath = "json/data/" +year + ".json";

  		//地图加载数据
  		d3.json(jsonpath, function(error, yeardata){
			//year1995 = root;//读取年份数据
			//d3.selectAll("#pie").transition().duration(350).remove();//删除原来的pie
			d3.selectAll("#pie").remove();

			//比例尺函数
	  		var scale = d3.scale.linear()
			.domain([yeardata.min, yeardata.max])
			.range([15, 35])
			.nice();

			nodes.forEach(function(d){
				var name = yeardata[d.name];
				if(name != undefined) {
					setTimeout(function(){pie(mapg, name, scale(name.sum), d, year);},30);
					//pie(mapg, name, scale(name.sum), d, year);
				}
			});

  			
		});
	}