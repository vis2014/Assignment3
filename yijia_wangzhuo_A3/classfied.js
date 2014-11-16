function K_classfied(classNumber){

	var k = classNumber;
	var indexesForRandom = new Array(samples.length);
	for(var i = 0;i<indexesForRandom.length;i++){
		indexesForRandom[i] = i;
	}
	var centers = new Array(k);
	var points = new Array(k);
	for(var i=0;i<k;i++){
		points[i] = new Array();
	}
	for(var i=0;i<k;i++){
		var newIndex = -1;
		while(newIndex==-1){
			newIndex = parseInt(Math.random()*samples.length);
			newIndex = (indexesForRandom[newIndex]==-1)?-1:newIndex;		}
		centers[i] = newIndex;
		indexesForRandom[newIndex]=-1;
	}
	
	for(var i=0;i<k;i++){
		var initialPoint = centers[i];
		centers[i] = new Array(traits.length);
		for(var x=0;x<traits.length;x++){
			centers[i][x] = samples[initialPoint][traits[x]];
		}
	}//设置初始中心点
	for(var loopTimes = 0;loopTimes<200;loopTimes++){
		for(var i=0;i<samples.length;i++){
			var similar = distance(samples[i],centers[0]);
			var locate = 0;//暂时中意第0个中心点
			for(var x = 1;x<centers.length;x++){
				var temp = distance(samples[i],centers[x]);
				if(temp>similar){
					locate = x;
					similar = temp;
				}
			}
			points[locate].push(i);
		}//为每个点分配所属中心
		for(var i=0;i<centers.length;i++){
			for(var x =0;x<traits.length;x++){
				centers[i][x] = samples[points[i][0]][traits[x]];
			}//中心点中的第一个数值赋给center
			for(var m=1;m<points[i].length;m++){
				for(var x = 0;x<traits.length;x++){
					centers[i][x] += samples[points[i][m]][traits[x]];
				}
			}//将中心点中的每个数值与center的数值进行加和
			
			for(var x=0;x<traits.length;x++){
				centers[i][x] = centers[i][x]/(points[i].length+0.0);
			}//针对中心点的每个数值求平均值
		}//调整中心点		
		if(loopTimes!=199){
			for(var i=0;i<points.length;i++)
				points[i] = [];//对中心点对应的数组清空,最后一次循环的结果不清空
		}
	}
	return points;		
}

function distance(sample,center){
	var sampleNum=0.0;
	var centerNum=0.0;
	var multiply = 0.0;
	for(var i=0;i<traits.length;i++){
		multiply += sample[traits[i]]*center[i];
		sampleNum +=Math.pow(sample[traits[i]],2);
		centerNum +=Math.pow(center[i],2);
	}
	sampleNum = Math.sqrt(sampleNum);
        centerNum = Math.sqrt(centerNum);
	return multiply/(sampleNum*centerNum);
}
