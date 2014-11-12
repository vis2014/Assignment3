#Assignment III: Text Visulization of the Speech "I Have a Dream"
###1. Github Address：[LiWenchao_WangXinyi_A3](https://github.com/vis2014/Assignment3/tree/LiWenchao_WangXinyi_A3 "LiWenchao & WangXinyi Assignment3").

###2. Package Description
It includes:

+ index.html: The main html to embed D3 script.
+ index.css: CSS of the network visualization and the main page.
+ js/d3.js: D3 library.
+ js/text.js: The D3 script to read text data and create visualization.
+ data/text.json: frequency of different words in the speech.
+ screenshot: One screenshot of the visualization.

###3. Operation of the Network Visualization 
+ Point to the circle to get a clearer view.
+ Click a circle, then the relevant data will be displayed above.

###4. Usage and Analysis
+ In the visualization above, each circle represents a frequent word in the speech. The sizes and the opacity of the circles are initially set relating to the frequency of the word in the center. The larger of the circles, the higher frequency of the word. Additionally, the radius is mapped to opacity between 0.4 and 0.9 .
+ After clicking a node, text description is also provided.
+ Accordding to the visualization, the keywords can be inferred from the highlighted word. Such as "freedom", "Negro", "dream" and "justice".

###5. Data
+ Data type: JSON.
+ [The Speech "I Have a dream"](http://news.bbc.co.uk/2/hi/americas/3170387.stm "I Have a dream"): The word's frequency is counted by another script language. Some of the words are deleted such as the preposition. Finally it is transformed to the file "text.json".