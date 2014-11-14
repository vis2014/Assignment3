#Chinese Word Cloud
### The brief introduction of our work.
What we do is **the visualization of text**. Take word cloud generator as the foundation and keep the function of rotation angle. 
In our program, we add the function to deal with **the Chinese key words**, and make it possible for users to **change the size of windows** in order to produce different QR code with different size and shape.

### Data Source.
In this program, we **do not need** the specific data resources. 
Users need to type in the input box (both Chinese and English are possible), click on the bottom ‘produce’ then users can see an image of the key words. 
To support the Chinese, we add in **a 800kb dictionary of Chines**e and **a 2000 words list of stop words** (called stopping-words list).

### The process of the visualization.
+ When users type in the words, firstly we separate the words and deal with stopping-words, then we use the separated words to produce the image as followed. 
![Figure 1](http://211.147.15.14/UCAS_14_Fall/images/e/ea/WangBingchen_LiuYang_A3_figure1.png)
+ In addition, we can **change the size** of it when we use the mouse to drag the dotted line of the frame of the key words, after clicking the bottom ‘produce’, the image will correspond to the changed frame of the key words. And the number of the words will change according to the range of the words.
![Figure 2](http://211.147.15.14/UCAS_14_Fall/images/9/91/WangBingchen_LiuYang_A3_figure2.png)
+ Also, our program includes a function to **generate the image when users underline a word**. When the users underline a paragraph of words in the text area, and click on ‘produce’, the image will be produced according to the words that are underlined, then users can click on the bottom ‘go back’ to go back to the interface before.
![Figure 3](http://211.147.15.14/UCAS_14_Fall/images/4/4e/WangBingchen_LiuYang_A3_figure3.png)

### Conclusion from visualization: 
+ When users produce the image of Chinese, it is more likely to see some phrases including many words rather than single words. 
+ The size of the dictionary is the most basic factor to determine the quality of the key words. However, because of the speed, the size of the dictionary cannot be bigger, and it has affected the result of the image.