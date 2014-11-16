var maxLength = 30,
    texts = [],
    width = 500,
    whratio = 0.7,
    wordsize = 50,
    horizratio = 1;

var form = d3.select("#cloud_options")
  .on("submit", function() {
    d3.event.preventDefault();
    if (d3.select("#text1").property("value") && d3.select("#text2").property("value")) generate();
    else alert("You must fill in both text boxes!");
});

var canvasSizeTab = d3.select("[name=canvassize]")
  .on("mousedown", function() {
    d3.select("svg").append("rect").attr("width", width).attr("height", width*whratio)
    .style("fill", "rgb(0,0,0").style("opacity", 0.5)
}).on("change", function() {
    width = d3.select("[name=canvassize]").property("value");
    d3.select("svg").attr("width", width).attr("height", width*whratio);
    d3.select("rect").attr("width", width).attr("height", width*whratio);
}).on("mouseup", function() {
    d3.select("rect").remove();
    layout.size([width, width*whratio]);
    if (d3.select("#text1").property("value") && d3.select("#text2").property("value")) generate();
});

var fontSizeTab = d3.select("[name=fontsize]")
  .on("mouseup", function() {
    wordsize = d3.select("[name=fontsize]").property("value");
    layout.fontSize(function (d) {
		  return d3.scale["sqrt"]().range([wordsize/10, wordsize])(d.size);
    });
    if (d3.select("#text1").property("value") && d3.select("#text2").property("value")) generate();
});

var colorTab = d3.select("[name=colors]")
  .on("change", function() {
    alert("I have not implemented this yet!");
});

var rotationTab = d3.select("[name=rotation]")
  .on("change", function() {
    horizratio = d3.select("[name=rotation]").property("value");
    if (d3.select("#text1").property("value") && d3.select("#text2").property("value")) generate();
});

var layout = d3.layout.compcloud()
	.size([width, width*whratio])
	.rotate(function() {
    if (Math.random() < horizratio) return 0;
    else return -90; })
  .fontSize(function (d) {
		return d3.scale["sqrt"]().range([5, 50])(d.size); })
	.diff(function (d) {
		return d.diff; })
	.on("end", draw);

var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
    punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g,
    wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
    discard = /^(@|https?:)/,
    htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g;

/**
 * method for eliminating duplicate elements in an array.
 * @param {Array} The array to remove duplicates from.
 * @return {Array} The array with duplicates removed.
 */
function unique(array) {
    var o = {}, i, l = array.length,
        r = [];
    for (i = 0; i < l; i++) o[array[i]] = 0;
    for (i in o) r.push(i);
    return r;
}

/**
 * Returns an array of objects representing the words in a comparative word cloud.
 * @param {string} text1 The first text to use in the word cloud.
 * @param {string} text2 The second text to use in the word cloud.
 * @return {Array} Array of word objects to be represented in the cloud.
 */
function parseTexts(text1, text2) {
    var texts = [text1, text2].map(function (text) {
        tags = {}, cases = {};
        text.split(wordSeparators).forEach(function (word) {
            if (discard.test(word)) return;
            word = word.replace(punctuation, "");
            if (stopWords.test(word.toLowerCase())) return;
            word = word.substr(0, maxLength);
            cases[word.toLowerCase()] = word;
            tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
        });
        return tags;
    });
    var tags = function (first, second) {
	    var addValues = function(obj) {
		    var sum = 0;
			Object.keys(obj).forEach(function(i) {
			    sum += obj[i];
			});
			return sum;
		};
		words1 = addValues(first);
		words2 = addValues(second);
        return unique(Object.keys(first).concat(Object.keys(second))).map(function (w) {
			var c1 = ((first[w] / words1)) || 0,
                c2 = ((second[w] / words2)) || 0;
            return {
                text: w,
                size: c1 + c2,
                diff: (c1 - c2) / (c1 + c2)
            };
        });
    }(texts[0], texts[1]);
    tags = d3.entries(tags).sort(function (a, b) {
        return b.value.size - a.value.size
    }).slice(0, 51);
    var max = tags[0].value.size;
    tags.forEach(function (d) {
        d.key = cases[d.key];
        d.value.size /= max
    });
    return tags;
}

/** 
 * Calculates the color of a word from it's difference.
 * @param {int} diff The diff of the word to be colored.
 * @return {string} A string representation of the rgb color of the word.
 */
function color(x) {
    var max = 240;
    var min = 100;
    var step = (max - min) / 10;
    green = min;
    if (x < 0) {
        red = max;
        blue = ~~ (max + step * 10 * x);
    } else {
        blue = max;
        red = ~~ (max - step * 10 * x);
    }
    return "rgb(" + red + "," + green + "," + blue + ")";
}

function draw(words) {
    d3.select("svg").remove();
    d3.select("#viz").append("svg").attr("width", width).attr("height", width*whratio).append("g").attr("transform", "translate(0,0)").selectAll("text").data(words).enter().append("text").style("font-size", function (d) {
        return d.size + "px";
    }).style("fill", function (d) {
        return color(d.diff);
    }).attr("text-anchor", "middle").attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    }).text(function (d) {
        return d.text;
    });
}

function make_cloud(text1, text2) {
	layout.words(parseTexts(text1, text2).map(function (d) {
		return d.value;
	})).start();
};

function generate() {
  texts = [];
  d3.selectAll("textarea")[0].forEach(function(textarea) {
    texts.push(textarea.value);
  });
  make_cloud(texts[0], texts[1]);
};
