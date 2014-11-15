#主题词云展示
###1. github地址：[Assignment3](https://github.com/vis2014/Assignment3/tree/GuoTianyou_CenWubin_A3).

###2. 数据来源说明
+ 主题模型是用于挖掘文本潜在语义的一种统计模型。需要指明的是，这边的主题并非通常意义上的主题，而是统计意义上面的主题。
+ 本项目的数据来源于使用PLSA对LDC2007T38进行训练输出的结果。在对输出结果进行一些格式转换之后，我们得到了项目所需的JSON格式包。
+ JSON格式包中数据包含若干个主题，以及这些主题下的若干个主题词（表示在某个主题下较高概率出现的词）。

###4. 项目说明
+ 本项目使用WordCloud布局展示了主题与主题词之间的关系分类。
+ topic_cloud/app/data 项目所用的数据
+ topic_cloud/app/simple.html 项目主页面
+ topic_cloud/js 项目所用js文件
+ topic_cloud/css/style.css 级联样式


