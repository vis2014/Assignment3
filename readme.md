#Assignment III: Text Visulization of the searching Social Network Worm in WOS
###1. Github Address：[Shaoxulong_Jiangxiaoming_A3](https://github.com/vis2014/Assignment3/tree/Shaoxulong_Jiangxiaoming_A3 "Shaoxulong & Jiangxiaoming Assignment3").
 
###2. Package Description
It includes:
+ css file:it includes index.css which is the CSS of the network visualization and the main page.
+ data file: it includes text.json which is the data source.
+ lib file: it includes d3.js and text.js which is the D3 script to read text data and create visualization.
+ index.html : the main html to show the visualization.
+ readme.md : the description of my project.
+ idea file : Automatically generated file when using  WebStorm create a project.

###3. Operation of the my Visualization
      +Click a circle, then  the html will show how many times it is mentioned in your seaching of WOS.And if it was menthioned more than 20 times ,it will recomment you to use the word to improve your seaching in your retrieval type.

###4. Usage and Analysis
+  When I take the lesson of "Discipline and situational analysis" ,I am faced with a problem about how to find a exact retrieval type retrieve of "Social Network Worm" ,so I do the visualization of  my first result by serching "Social Network Worm". Accordding to the visualization ,I got the finally retrieval type :(”Social Network” OR Dynamic OR Neighbor )AND ”Worm”.
+  In the visualization above, each circle represents a frequent word in the serching file. The sizes and the opacity of the circles are initially set relating to the frequency of the word in the center. The larger of the circles, the higher frequency of the word. Additionally,
+  After clicking a node, text description and advice is  provided.
+  Accordding to the visualization, I can use the word like "Dynamic" in my  retrieval type.

###5. Data
+  Data type: JSON.
+  Firstly ,I got the file in type of txt from [WOS] (http://www.webofknowledge.com/WOS ) by searching "Social Network" And Worm in it and the file includes title ,keyword and author of the paper. Then I converted it into Excel file and txt file which include the word and the times it appears. by the software named Replace Pioneer. Finally I converted it into text.json  which is easy to operate by writing java.

