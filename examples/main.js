/**
 * Created by Administrator on 14-11-16.
 */
var fill = d3.scale.category20();
var myWords = [
    "Hello", "world", "normally", "you", "want", "more", "words",
    "than", "this","Hello","Hello","Hello","Hello","Hello"];
var showWordsPercentage = 0.2;
var myText;
var myWords2 = new Array();
d3.text("sample.txt",function(text)
{
    myText = text;
    //提取单词至myWords2
    returnWords();
    function returnWords()
    {
        var i = 0,l=0;
        var temp = "";
        while(i<myText.length)
        {
            temp ="";
            //去掉空格与逗号句号
            while(myText[i] != " "&&myText[i] != ","&&myText[i] != "."&&myText[i] != "\""&&i<myText.length)
            {
                temp = temp+myText[i];
                i++;
            }
            i++;
            //去掉of ，and ，both ，to ，on ,for等词语
            if(!belongToConjunction(temp)){
            myWords2.push(temp);
            }

        }
    }
    //判断是否是连词,代词等
    function belongToConjunction(word)
    {
        var Conjunction = ["a","A","of","and","both","to","on","for","in","at","he","He","she","it","what","which","am",
            "are","is","we","We","The","the","i","I","you","You","They","our","all","that","as","such","so","it","if","It"
        ,"this","This","also","have"];

        var i = 0,l = Conjunction.length;
        while(i<l)
        {
            if(word == Conjunction[i])
            {
                return true;
            }
            i++;
        }
        return false;
    }
    console.log(myWords2);
    //去掉重复，并计算数量
    var wordAndCount = {
        'word':"",
        'count':1
    };
    var wordAndCountArray = new Array();

    wordCount();
    function wordCount(words)
    {
        var i= 0,l=myWords2.length;
        while(i<l){
            wordAndCount = new Object();
            wordAndCount.word = myWords2[i];
            wordAndCount.count = 1;
            if(findWord(myWords2[i]) != -1)
            {
                wordAndCountArray[findWord(myWords2[i])].count++;
            }
            else
            {
                wordAndCountArray.push(wordAndCount);
                //alert("push "+wordAndCount.word);
            }
            i++;
        }
    }
    //如词已经在数组中则返回位置，否则返回-1
    function findWord(word)
    {
        var i=0;
        while(i<wordAndCountArray.length)
        {
            if(word == wordAndCountArray[i].word)
            {
                //alert("find "+word);
                return i;
            }
            i++;
        }
        //alert("not find "+word);
        return -1;
    }
    //提到次数少的不算

    DeleteWordsLess();
    function DeleteWordsLess(){
        var i=0;l=wordAndCountArray.length;
        while(i<wordAndCountArray.length)
        {
            if(wordAndCountArray[i].count < myWords2.length*showWordsPercentage/100)
            {
                wordAndCountArray[i].word = "";
            }
            i++;
        }
    }


    d3.layout.cloud().size([1000, 1000])
        .words(wordAndCountArray.map(function(d) {
            return {text: d.word, size: d.count*5};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();
});
/*
function brighter(color)
{
    var temp="";
    var i= 1,l=color.length;
    console.log(l);
    while(i<l)
    {
        temp += color[i];
        i++;
    }
    var n = parseInt(temp,16);
    n += 222222;
    n= n.toString(16);
    console.log("temp "+temp);
    console.log("n "+ n);
    console.log("new color #"+n);
    return ("#"+n.toString);
}*/

function draw(words) {
    var word_image = d3.select("body").append("svg")
        .attr("width", 1500)
        .attr("height", 1500)
        .append("g")
        .attr("transform", "translate(600,600)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on("mouseover",function(d,i){
            word_image.style("fill",function(word,index)
            {
                if(word == d)
                {
                    console.log("old color "+fill(index));
                    return "ff0000";
                }
                else
                {
                    return fill(index);
                }
            });
        });
}