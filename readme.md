this is the beijing map,demonstrating the popularity,GDP of BJ in 2013.


To implement the effective,we should get familiar with the prejection.the map's latitude and longitude can accurately locate a place on the earth,but if we want to draw a map on a screen(most maps are 2-D),we should find out a algorithm to change a 3-D lat,longt data into 2-D location.So we use prejection to do such work.


The first thing to draw is to load the json map,we use the list [(latitudes,longitude)] to draw a path.Different districts have different GDP or popularity,so we use color.range() to emphasis  the variation._There is a bug in showing the popularity.Even I added more color in color.range,the map only shows two colors.But other aspects have perfect effects,which frustrated me._Additional function is mouse hovering,which could show details of a district.


the program's structure is below:
+d3/d3.js           ---this is d3 source
+data/BeijingGDP.cvs  ./BJGeoJson.json         ----*.cvs is the GDP data,*.json is the geo data. 
+BJGeo.html          ---self built javascript is embedded into the html file.