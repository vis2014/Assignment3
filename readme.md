#Chinese population growth and flow analysis

##Presented by Jiaozekun && Chenwenbin


This is a visualization I have done to show the increase of Chinese population from 1982(the 4th Population Census) to 2010(the 6th Population Census) and the flow of people between different provinces.This dataset is downloaded from the website of National Bureau of Statistics.We use two kinds of graph to find more insights in these data.

###1. Dataset:
+ We collect all the data manually on http://www.stats.gov.cn/tjsj/ndsj/renkoupucha/2000pucha/pucha.htm and http://www.stats.gov.cn/ztjc/zdtjgz/zgrkpc/dlcrkpc/.
+ From the above data,we can acknowledge the population of each province in 1982,1990,2000 and 2010.
+ The data of population flow between 1990-2000 and 2000-2010 can be found on the websites.But the data for 1982-1990 is hard to access for there is no excel file at that time.

###2. Instruction and Interaction:
> ####The increase of population for each province
>1.The first page(population_increase.html) shows the population increase of each province,the four axes each stands for a year.
>2.I separate all the provinces into five regions in order to compare the differences among different regions.    
>3.Besides,you can drag each axis.
>####The flow of population among these provinces
>1.flow1.html and flow2.html each represents the population flow of a decade.I use a chord graph as a visualization.
>2.As is shown,I separate the whole ring into 32 different parts,each parts stands for a province.The angle it occupies is in proportion to its number of floating population.
>3.For each province(for each arc),the arc is separated into 31 different parts again.Each represents the number of people who move to this province,and they are sorted and listed in the clockwise direction.
>4.When mouse over a chord,the information in this chord will be displayed in a window on the right side and the chord will be lighter than any other chord in the graph.

###3.Findings and Insights
>1.From the chart which visualizes the increase,we can see that the population of most province is stable,but in CentralSouth its growth is obvious.
>2.In the chord graph which shows the population flow,we can see that there are some provinces people all want to move to,such as Guangdong,Beijing,Shanghai,Jiangsu,Zhejiang.This phenomenon may be due to their better economic level and salary.
>3.We can also find that the migration is regional.For example,we can see that the arc stands for Guangdong Province is separated into different smaller arcs.Among these arcs,the several relatively larger ones are population flows from Hunan,Guangxi,Sichuan and so on,which are all close to Guangdong.Thus we can acknowledge that people prefer to move to a nearer province than a further one.
>4.When compare the two chord graphs,we can find that the arcs which stands for Beijing,Guangdong,Shanghai,Zhejiang in the 6th Census are even larger than in the 5th Census.So we can say that in recent years people are more likely to move to so-called "北上广深".
###4. Environment:
+ Please open the **population_increase.html** and click the links on this page to see two more graphs.As for browser,Chrome is recommended.

See further information, click [here](http://211.147.15.14/UCAS_14_Fall/index.php/Jiaozekun_Chenwenbin_A3).