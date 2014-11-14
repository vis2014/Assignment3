var dict = "";
var stopwdlist = "";
//ajax 装载字库
window.onload = function() {
    new Ajax.Request('Dict/dict.txt', {onComplete: function (response) {
        dict = response.responseText + "";
    }});
    new Ajax.Request('Dict/stopword.txt', {onComplete: function (response) {
        stopwdlist = response.responseText + "";
    }});
}
var fill = d3.scale.category20b();

var w = document.getElementById("vis").scrollWidth,
    h = document.getElementById("vis").scrollHeight;
var rotateFlag = "flag1";
var words = [],
    max,
    scale = 1,
    complete = 0,
    tags,
    fontSize,
    maxLength = 30,
    fetcher,
    statusText = d3.select("#status");

var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([w, h])
    .fontSize(function(d) { return fontSize(+d.value); })
    .text(function(d) { return d.key; })
    .on("word", progress)
    .on("end", draw);

var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);

var background = svg.append("g"),
    vis = svg.append("g")
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

d3.select("#download-svg").on("click", downloadSVG);
d3.select("#download-png").on("click", downloadPNG);

d3.select(window).on("hashchange", hashchange);

var form = d3.select("#form")
    .on("submit", function() {
        w = document.getElementById("vis").scrollWidth,
        h = document.getElementById("vis").scrollHeight;
        svg.attr("width", w)
            .attr("height", h);
        layout.size([w, h]);
        vis.attr("transform", "translate(" + [w >> 1, h >> 1] + ")");


        var temp = getFieldSelection(document.getElementById('text'));
        if(temp.length==0)
            load(d3.select("#text").property("value"));
        else
        {
            beforeWords = document.getElementById('text').value;
            load(temp);
            document.getElementById("gob2b").style.visibility = "visible";
            document.getElementById("go").style.visibility = "hidden";
        }
        d3.event.preventDefault();
    });
form.selectAll("input[type=number]")
    .on("click.refresh", function() {
        if (this.value === this.defaultValue) return;
        generate();
        this.defaultValue = this.value;
    });
form.selectAll("input[type=radio], #font")
    .on("change", generate);

// From Jonathan Feinberg's cue.language, see lib/cue.language/license.txt.
var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
    punctuation = new RegExp("[" + unicodePunctuationRe + "]", "g"),
    wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:|\/\/)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
    matchTwitter = /^https?:\/\/([^\.]*\.)?twitter\.com/;

function getFieldSelection(select_field)
{
    var seletedWORD='';
    if (document.selection) {
        var sel = document.selection.createRange();
        if (sel.text.length > 0) {
            seletedWORD = sel.text;
        }
    }
    else if (select_field.selectionStart || select_field.selectionStart == '0') {
        var startP = select_field.selectionStart;
        var endP = select_field.selectionEnd;
        if (startP != endP) {
            seletedWORD = select_field.value.substring(startP, endP);
        }
    }
    return seletedWORD;
}

/////////////////////////分词部分/////////////////////////////////////

var rsText;
var tempText;

function divide(text){
    if(text.length==0) return true;
    var word = text.substring(0,1)+"";
    var regExp = /\w/;
    //英文
    if(regExp.test(word)){
        var tmp = text.replace(/^\s*(\w+)\s*.*$/,"$1");
        text = text.replace(/^\s*\w+\s*/,"");
        rsText += tmp+" ";
        divide(text);
        return;
    }

    var words = [];
    var end = 0;
    var start = -1;
    while((start = dict.indexOf('-'+word,end))!=-1){
        //document.write(word+":"+dict[start+1]+"-----");
        end = dict.indexOf('-',start+1);

        if(start==-1||end==-1) return false;
        if(start>end) return false;
        words.push(dict.substr(start,end-start).replace("-",""));
    }

    var tmp = "";
    for(j=0;j<words.length;j++){
        //找到最长的词，当然也可以将所有词保留
        if(text.indexOf(words[j])!=-1&&words[j].length>tmp.length){
            tmp=words[j];
        }
    }
    //词库不存在的
    if(tmp == ""){
        tmp = word;
    }
    text=text.replace(tmp,"");
    if(tmp.replace(/\s/g,'')!="")
    {
        if((stopwdlist.indexOf(tmp))==-1)
            rsText += tmp+" ";
        //   document.write(tmp);
    }
    divide(text);
}

//////////////////////////////////////////////////////////////////////
function parseText(text) {
    tempText = text;        //调用分词程序
    rsText="";
    divide(tempText);

    tags = {};
    var cases = {};
    rsText.split(wordSeparators).forEach(function(word) {
        if (discard.test(word)) return;
        word = word.replace(punctuation, "");
        if (stopWords.test(word.toLowerCase())) return;
        word = word.substr(0, maxLength);
        cases[word.toLowerCase()] = word;
        tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
    });
    tags = d3.entries(tags).sort(function(a, b) { return b.value - a.value; });
    tags.forEach(function(d) { d.key = cases[d.key]; });
    generate();
}

function generate() {

    layout
        .font(d3.select("#font").property("value"))
        .spiral(d3.select("input[name=spiral]:checked").property("value"));
    fontSize = d3.scale[d3.select("input[name=scale]:checked").property("value")]().range([10, 100]);
    if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
    complete = 0;
    statusText.style("display", null);
    words = [];
    layout.stop().words(tags.slice(0, max = Math.min(tags.length, +d3.select("#max").property("value")))).start();
}

function progress(d) {
    statusText.text(++complete + "/" + max);
}

function draw(data, bounds) {

    statusText.style("display", "none");
    scale = bounds ? Math.min(
            w / Math.abs(bounds[1].x - w / 2),
            w / Math.abs(bounds[0].x - w / 2),
            h / Math.abs(bounds[1].y - h / 2),
            h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
    words = data;
    var text = vis.selectAll("text")
        .data(words, function(d) { return d.text.toLowerCase(); });
    text.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate +")"; })
        .style("font-size", function(d) { return d.size + "px"; });
    text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate +")"; })
        .style("font-size", function(d) { return d.size + "px"; })
        .style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1);
    text.style("font-family", function(d) { return d.font; })
        .style("fill", function(d) { return fill(d.text.toLowerCase()); })
        .text(function(d) { return d.text; });
    var exitGroup = background.append("g")
        .attr("transform", vis.attr("transform"));
    var exitGroupNode = exitGroup.node();
    text.exit().each(function() {
        exitGroupNode.appendChild(this);
    });
    exitGroup.transition()
        .duration(1000)
        .style("opacity", 1e-6)
        .remove();
    vis.transition()
        .delay(1000)
        .duration(750)
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

// Converts a given word cloud to image/png.
function downloadPNG() {
    var canvas = document.createElement("canvas"),
        c = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;
    c.translate(w >> 1, h >> 1);
    c.scale(scale, scale);
    words.forEach(function(word, i) {
        c.save();
        c.translate(word.x, word.y);
        c.rotate(word.rotate * Math.PI / 180);
        c.textAlign = "center";
        c.fillStyle = fill(word.text.toLowerCase());
        c.font = word.size + "px " + word.font;
        c.fillText(word.text, 0, 0);
        c.restore();
    });
    d3.select(this).attr("href", canvas.toDataURL("image/png"));
}

function downloadSVG() {
    d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
        svg.attr("version", "1.1")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML))));
}

function hashchange(fallback) {
    var h = location.hash;

    if (h && h.length > 1) {
        h = decodeURIComponent(h.substr(1));
        if (h !== fetcher) load(h);
    } else if (fallback) load(fallback);
}
load("《解放奴隶宣言》（The Emancipation Proclamation）是份由美国总统亚伯拉罕·林肯公布的宣言，" +
    "其主张所有美利坚邦联叛乱下的领土之黑奴应享有自由，然而豁免的对象包含未脱离联邦的边境州，以及联邦掌控下的诸州。" +
    "此宣言仅立即解放少部分奴隶，但实质上强化联邦军掌控邦联的领土后这些黑奴自由的权威性，并为最终废除全美奴隶制度预先铺路。" +
    "1861年俄国沙皇亚力山大二世推行的改革。这次改革废除了农奴制，农奴成为自由人，为资本主义的发展提供了大量的自由劳动力。" +
    "巨额的份地赎金为资本主义的发展又积累了大量资金。俄国从此走上了资本主义发展的道路。1861年改革是俄国历史上的一个重大转折点。" +
    " 同时，1861年改革也保留大量封建残余，对俄国社会后来的发展产生了消极影响。       解放奴隶宣言除了对黑奴有限的立即效果外，" +
    "此宣言象征北方人的战争目的改变：重整联邦不再是战争唯一的目的。这代表一个迈向废除全联邦奴隶制度的重要阶段。 　　" +
    "此外，有些黑奴因宣言而立即重获自由。这些在联邦边际线脱逃且为联邦军队称作“战争违禁品”（contraband of war）的黑奴被带到走私管制营区；" +
    "当宣言生效后，他们在半夜被告知可以自由离开。另外，佐治亚州外海的岛屿在战争期间为联邦海军所占领，故当地白人多逃回美洲大陆，留下黑奴在此生活。" +
    "海军将官当他们的面读诵宣言并告知他们自由了。 　　军队里对此宣言的反应各有不同。部分单位差点发动兵谏，有些则因听说此宣言而集体开小差；" +
    "但另一方面，其他单位盼望该理想能立法通过使其更显尊贵，为此至少一个单位采用了格言：“为联邦与自由”。 　　而对邦联而言，" +
    "黑奴问题是“战争发动机”的一部分：这些黑奴负责生产和存备食粮、修复铁路、在农田与工场中作工、运输船只、挖矿、建筑防御工事以及从事看护工作" +
    "和一般劳工。为了激发邦联内部黑奴们的不满，数以百万份的《解放黑奴宣言》在联邦占领的邦联属地流传。而且如同期望般，此消息透过口传方式迅速散播，" +
    "并燃起人们对自由的希冀和造成大众的混乱，以及鼓励许多黑奴起身脱逃。 编辑本段国际 　　在海外，如同林肯的期望，" +
    "此宣言使他国民意转而支持联邦终结奴隶制度的承诺。这种转变粉碎邦联政府获取他国官方承认的希望，特别是与英国。如同亨利·亚当斯（Henry Adams）" +
    "所言：“《解放黑奴宣言》比我们之前的胜仗与外交策略做得更多。” 编辑本段内战之后 　　战争末期，美国共和党中的废奴论者推断一旦战争结束后" +
    "《解放黑奴宣言》将可能被解读成一份违宪的战时命令，故他们千方百计想保障所有黑奴的自由，而非仅止于宣言赋予的解放。在此压力下，" +
    "林肯以他在1864年的总统选战作为他将透过宪法修正案的方式废除全国奴隶制度之赌注。林肯的选战获得马里兰州与密苏里州分裂票数支持；" +
    "马里兰州于1864年11月1日生效的新宪章废除奴隶制度。赢得连任后，林肯强力催促“跛鸭的”第38届国会在第39届国会集会立即通过宪法修正案。" +
    "1865年1月31日国会通知各州议员批准将成为美国宪法第13号修正案的法案，其禁止美国国土上任何的畜奴行为。1865年12月6日，" +
    "修正案为足够多的州所认可。其作为一个实行的法条，至今为止肯塔基州是全美唯一不为修正案以外方式解放黑奴的地方。         " +
    " 俄国的1861年改革废除了农奴制，为俄国资本主义发展提供了必要的自由劳动力、广阔的国内市场、资本以及相对稳定的社会环境，" +
    "同时建立了相应的司法体系，加快了俄国工业化的历史进程。从此，俄国开始从农奴制时代进入了一个崭新的历史发展阶段，走上了资本主义发展道路，" +
    "并在改革后逐渐确立资本主义制度。但这次改革很不彻底，保留大量封建残余，农奴生活仍没有本质提高，民主革命依然是俄国社会发展所面临的历史使命。");
function load(f) {
    fetcher = f;
    var h = /^(https?:)?\/\//.test(fetcher)
        ? "#" + encodeURIComponent(fetcher)
        : "";
    if (fetcher != null) d3.select("#text").property("value", fetcher);
    if (location.hash !== h) location.hash = h;
    //if (h) getURL(fetcher, parseHTML);//解析HTML的功能不要了
    if (fetcher) parseText(fetcher);
}

d3.select("#random-palette").on("click", function() {
    paletteJSON("http://www.colourlovers.com/api/palettes/random", {}, function(d) {
        fill.range(d[0].colors);
        vis.selectAll("text")
            .style("fill", function(d) { return fill(d.text.toLowerCase()); });
    });
    d3.event.preventDefault();
});

(function() {
    var r = 40.5,
        px = 35,
        py = 20;

    var angles = d3.select("#angles").append("svg")
        .attr("width", 2 * (r + px))
        .attr("height", r + 1.5 * py)
        .append("g")
        .attr("transform", "translate(" + [r + px, r + py] +")");

    angles.append("path")
        .style("fill", "none")
        .attr("d", ["M", -r, 0, "A", r, r, 0, 0, 1, r, 0].join(" "));

    angles.append("line")
        .attr("x1", -r - 7)
        .attr("x2", r + 7);

    angles.append("line")
        .attr("y2", -r - 7);

    angles.selectAll("text")
        .data([-90, 0, 90])
        .enter().append("text")
        .attr("dy", function(d, i) { return i === 1 ? null : ".3em"; })
        .attr("text-anchor", function(d, i) { return ["end", "middle", "start"][i]; })
        .attr("transform", function(d) {
            d += 90;
            return "rotate(" + d + ")translate(" + -(r + 10) + ")rotate(" + -d + ")translate(2)";
        })
        .text(function(d) { return d + "°"; });

    var radians = Math.PI / 180,
        from,
        to,
        count,
        scale = d3.scale.linear(),
        arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(r);

    d3.selectAll("#angle-count, #angle-from, #angle-to")
        .on("change", getAngles)
        .on("mouseup", getAngles);

    getAngles();

    function getAngles() {
        count = +d3.select("#angle-count").property("value");
        from = Math.max(-90, Math.min(90, +d3.select("#angle-from").property("value")));
        to = Math.max(-90, Math.min(90, +d3.select("#angle-to").property("value")));
        update();
    }

    function update() {
        scale.domain([0, count - 1]).range([from, to]);
        var step = (to - from) / count;

        var path = angles.selectAll("path.angle")
            .data([{startAngle: from * radians, endAngle: to * radians}]);
        path.enter().insert("path", "circle")
            .attr("class", "angle")
            .style("fill", "#fc0");
        path.attr("d", arc);

        var line = angles.selectAll("line.angle")
            .data(d3.range(count).map(scale));
        line.enter().append("line")
            .attr("class", "angle");
        line.exit().remove();
        line.attr("transform", function(d) {
            if(d>0)
                return "rotate(180)";
            return "rotate(0)";
            //return "rotate(" + (90 + d) + ")";
        })
            .attr("x2", function(d, i) { return !i || i === count - 1 ? -r - 5 : -r; });

        var drag = angles.selectAll("path.drag")
            .data([from, to]);
        drag.enter().append("path")
            .attr("class", "drag")
            .attr("d", "M-9.5,0L-3,3.5L-3,-3.5Z")
            .call(d3.behavior.drag()
                .on("drag", function(d, i) {
                    d = (i ? to : from) + 90;
                    var start = [-r * Math.cos(d * radians), -r * Math.sin(d * radians)],
                        m = [d3.event.x, d3.event.y],
                        delta = ~~(Math.atan2(cross(start, m), dot(start, m)) / radians);
                    d = Math.max(-90, Math.min(90, d + delta - 90)); // remove this for 360掳
                    delta = to - from;
                    if (i) {
                        to = d;
                        if (delta > 360) from += delta - 360;
                        else if (delta < 0) from = to;
                    } else {
                        from = d;
                        if (delta > 360) to += 360 - delta;
                        else if (delta < 0) to = from;
                    }
                    update();
                })
                .on("dragend", generate));
        drag.attr("transform", function(d) { return "rotate(" + (d + 90) + ")translate(-" + r + ")"; });
        layout.rotate(function() {
            return scale(~~(Math.random() * count));
        });
        d3.select("#angle-count").property("value", count);
        d3.select("#angle-from").property("value", from);
        d3.select("#angle-to").property("value", to);
    }

    function cross(a, b) { return a[0] * b[1] - a[1] * b[0]; }
    function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }

})();