##copyright
__you can not use the source code before the final check by the teacher.__

designed by __wangzhuo__ and __yijia__.

##data source
We got the results from a questionnaire about favourite sports ranging from 0 to 10 points in network, and 151 students participated in the survey. The sports in the questionnaire are tennis,football,basketball and swimming. At last transform the results into a csv file.

The information in the csv file include __name__, __bastketball__,__football__,__tennis__,__swimming__ .


##description
*   Different from the iris-parallel example, there are no classified species before visualization, therefore we introduced the K-nearestNeighbour Algorithm to divide the students into different teams according to their favourite degree on the sports mentioned above automatically. 
*   But the user should input a number between 1 and 20 in the [input type="text"]() to specify the number of classes, then we'll show the lines in different color. Besides, one color means a different class from the others. 
*   Maybe all classes showed simultaneously is too massive, we offer an option to show specified class, what you need to do is just type a number between 0 and classNumber-1 in the second text area. After that, you could see the class of which the students have the similar favourites.
*   Click "seeAllClasses" button to see all classes you specified.

##Online
View our results [here](http://yijia.ws/pages/force_new.html) online.

##offline
To see all effects, we recommand you to use firefox. If you must use chrome, please set your local server.

ex, for python, you can type: __python -m SimpleHTTPServer 8888__, then you can visit [http://localhost:8888](http://localhost:8888).

