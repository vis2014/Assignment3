// JavaScript source code
var width = 1024;
var height = 1000;
var words = []; //存储情感词
var wordsvalue = [];//存储极值
var wordsSelect = []; //存储选择的情感词
var wordsvalueSelect = [] //存储选择的极值 
var x = 0, y = 0;
var size = [30, 50,70];//表示每层放置几个路径
var fill = d3.scale.category20();//设置20种颜色
var dataset; //数据源
var name;//定义标题
var name_length;//标题的长度
var circle_r;//圆的半径
var layer = 3;//表示生成几层的图形
d3.json("json/SentimentWords.json", function (error, data) { //添加json数据
   
    dataset = data;
});
    
    function findWords(value) { //获取情感词
        wordsSelect = [];
        x = 0;
        for (var i = 1; i < dataset.nodes.length; i++){
            if(value==0){
                wordsSelect[x] = dataset.nodes[i].SentimentWords;
                x++;
             }
            if(value==1){
                if (parseFloat(dataset.nodes[i].extremum) > 0) {
                    wordsSelect[x] = dataset.nodes[i].SentimentWords;
                    x++;
                }
            }
            if (value == 2) {
                if (parseFloat(dataset.nodes[i].extremum) < 0) {
                    wordsSelect[x] = dataset.nodes[i].SentimentWords;
                    x++;
                }
            }

        }
        return wordsSelect;
    }

    function findextremum(value) { //获取极值
        wordsvalueSelect = [];
        y = 0;
        for (var i = 1; i < dataset.nodes.length; i++) {
            if (value == 0) {
                wordsvalueSelect[y] = parseFloat(dataset.nodes[i].extremum);
                y++
            }
            if (value == 1) {
                if (parseFloat(dataset.nodes[i].extremum) > 0) {
                    wordsvalueSelect[y] = parseFloat(dataset.nodes[i].extremum);
                    y++;
                }
            }
            if (value == 2) {
                if (parseFloat(dataset.nodes[i].extremum) < 0) {
                    wordsvalueSelect[y] = parseFloat(dataset.nodes[i].extremum);
                    y++;
                }
            }
        }
        return wordsvalueSelect;
    }

    function setLayerAndSize() { //设置图形层数
        var word_size = words.length;
        if (word_size < size[0] + size[1]+size[2]) {
            if (word_size <= size[0]) {
                layer = 1;
                size[2] = 0;
                size[1] = 0;
                size[0] = word_size;
            }
            if (word_size < size[0] + size[1]){
                layer = 2;
                size[2] = 0;
                size[1] = word_size - size[0];
                size[0] = 30;
            }
            
        }
        else {
            layer = 3;
            size[0] = 30;
            size[1] = 50;
            size[2] = 70;
        }
    }

    function createWordCloud() {
        setLayerAndSize();
        // 先在 svg 中插入一個圆
        d3.select("svg").remove();
        svg = d3.select('body').append('svg').attr("width", width).attr("height", height);
        svg.append('circle').attr({
            id: "circle",
            cx: width / 2,
            cy: height / 2 -80,
            r: circle_r,
            stroke: "white",
            fill: "#219E3E",
            'stroke-with': 50
        });
        svg.append('text').attr({
            x: width / 2,
            y: height / 2-80 ,
            "font-size": 25 * Math.log(name_length),
            "text-anchor": "middle",
            fill: "white"
        }).text(name);
        var current_word = 0;
        for (var i = 0; i < layer; i++) {
            var part_number = size[i];//第i层的路径数目
            var r_layer_start = circle_r + 10 + 100 * i;
            var r_layer_end = circle_r + 200 + 100 * i;
            var sita = Math.PI / 180 *30;
            for (var j = 0; j < part_number; j++) {
                var start_x = width / 2 + r_layer_start * Math.cos(j * 2 * Math.PI / part_number + i * sita);
                var start_y = height / 2-80  + r_layer_start * Math.sin(j * 2 * Math.PI / part_number + i * sita);
                var end_x = width / 2 + r_layer_end * Math.cos(j * 2 * Math.PI / part_number + i * sita);
                var end_y = height / 2 -80 + r_layer_end * Math.sin(j * 2 * Math.PI / part_number + i * sita);
                svg.append("path").attr({
                    id: current_word,
                    d: 'M' + start_x + ' ' + start_y + ' ' + 'L' + end_x + ' ' + end_y
                }).attr("class", "path");
                svg.append('text').attr({
                    x: 5,
                    y: 10,
                    "font-size": 10 + 10 * Math.abs(wordsvalue[current_word]),
                    fill: function () { return fill(words[current_word]); },
                    "font-weight": "bold"
                }).append('textPath').attr({
                    'xlink:href': '#' + current_word
                }).text(words[current_word])
                //  .on("mouseover", function () {
                //      highlight(this);
                //  })
                //  .on("mouseout", svg.selectAll("text").style("fill", function () {
                //      return fill(words[current_word]);
                //  })
                //      )
                current_word = current_word + 1;
            }
        }

    }  
 
    function refresh(value) { //根据单选按钮，刷新界面
        words = [];
        wordsvalue = [];
        switch (value) {
            case 'All':
                words = findWords(0); //生成情感词数组
                wordsvalue = findextremum(0); //生成极值数组
                break;
            case 'positive':
                words = findWords(1); 
                wordsvalue = findextremum(1);
                break;
            case 'negative':
                words = findWords(2);
                wordsvalue = findextremum(2);
                break;
            default: break;
        }
       
        name = value;  //中心圆中的关键字
        name_length = name.length; 
        circle_r = 60 * Math.log(name_length) ; //中心圆的大小
       
        createWordCloud();

       
    }

 
