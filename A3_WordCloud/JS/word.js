var fill = d3.scale.category20b();//设置20种颜色
var head;//定义标题
var description;//定义描述
var totalData;//所有的数据
var words =[]; //存储所有的字云key：字，value:出现的次数
var width=1024;
var height=800;
var head_length;//标题的长度
var circle_r;//圆的半径
var layer=2;//表示生成几层的图形
var size=[8,8];//表示每层放置几个路径
var svg = d3.select('body').append('svg');    // 在 body 中插入一個 svg
svg.attr("width",width).attr("height",height);
d3.json("Data/constellation.json",function(error,data){
   // alert(data);
    totalData=data;
});
function findDescription(head){
    for(var i=1;i<totalData.constellation.length;i++){
        if(totalData.constellation[i].name==head){
            return totalData.constellation[i].description;
        }
    }
}
// From Jonathan Feinberg's cue.language, see lib/cue.language/license.txt.
var maxLength = 30; //设置单词的最大长度
var stopWords = /^(one|two|three|four|five|also|else|often|self|people|always|way|i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
    punctuation = new RegExp("[" + unicodePunctuationRe + "]", "g"),
    wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:|\/\/)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
    matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;
//统计原文字的信息，并生成一个一个的单词，并且根据字的大小进行排序，
function parseText(text) {
    tags = {};
    var cases = {};
    text.split(wordSeparators).forEach(function(word) {
        if (discard.test(word)) return;
        word = word.replace(punctuation, "");
        if (stopWords.test(word.toLowerCase())) return;
        word = word.substr(0, maxLength);
        cases[word.toLowerCase()] = word;
        tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
    });
    tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
    tags.forEach(function(d) { d.key = cases[d.key]; });
    return tags;
    //console.log(tags); //tags包含两种信息：key:一个字；value:这个字的大小
}

function pureText(){
    var text=d3.select("#text_area").property("value");
    parseText(text);
}
function refresh(name){
    head=name; //标题
    head_length=head.length; //标题长度
    circle_r=60*Math.log(head_length)+15;
    description=findDescription(head); //描述
    words=parseText(description);//将描述转换成字云
    //console.log(words);
    createWordCloud();
}
//计算字云的层数和每层的数目
function setLayerAndSize(){
    var word_size=words.length;
    if(word_size<size[0]+size[1]){
        if(word_size<=size[0]){
            layer=1;
            size[1]=0;
            size[0]=word_size;
        }
        else{
            layer=2;
            size[1]=word_size-size[0];
        }
    }
    else{
        layer=2;
        size[0]=8;
        size[1]=8;
    }
}
//创建字云
function createWordCloud(){
    setLayerAndSize();
    // 先在 svg 中插入一個圆
    d3.select("svg").remove();
    svg=d3.select('body').append('svg').attr("width",width).attr("height",height);
    svg.append('circle').attr({
        id:"circle",
        cx:width/2,
        cy:height/2+50,
        r:circle_r,
        stroke:"white",
        fill:"#219E3E",
        'stroke-with' :50
    });
    svg.append('text').attr({
        x:width/2,
        y:height/2+50,
        "font-size":30*Math.log(head_length),
        "text-anchor":"middle",
        fill:"white"
    }).text(head);
    var current_word=0;
    for(var i=0;i<layer;i++){
        var part_number=size[i];//第i层的路径数目
        var r_layer_start=circle_r+50+100*i;
        var r_layer_end=circle_r+350+100*i;
        var sita=Math.PI/180*20;
        for(var j=0;j<part_number;j++){
            var start_x=width/2+r_layer_start*Math.cos(j*2*Math.PI/part_number+i*sita);
            var start_y=height/2+50+r_layer_start*Math.sin(j*2*Math.PI/part_number+i*sita);
            var end_x=width/2+r_layer_end*Math.cos(j*2*Math.PI/part_number+i*sita);
            var end_y=height/2+50+r_layer_end*Math.sin(j*2*Math.PI/part_number+i*sita);
            svg.append("path").attr({
                id:current_word,
                d:'M'+start_x+' '+start_y +' '+'L'+end_x+' '+end_y
            }).attr("class","path");
            svg.append('text').attr({
                x:10,
                y:20,
                "font-size":54+words[current_word].value,
               fill: function() { return fill(words[current_word].key.toLowerCase()); },
                "font-weight":"bold"
            }).append('textPath').attr({
                    'xlink:href':'#'+current_word
                }).text(words[current_word].key);
            current_word=current_word+1;
        }
    }
}

function createByUser(){
    var name=d3.select("#head").property("value");
    var text=d3.select("#text_area").property("value");
    head=name; //标题
    head_length=head.length; //标题长度
    circle_r=60*Math.log(head_length)+15;
    description=text;
    words=parseText(description);//将描述转换成字云
    //console.log(words);
    createWordCloud();
}




