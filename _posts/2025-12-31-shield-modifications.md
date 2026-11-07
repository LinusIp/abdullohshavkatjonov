---
title: "Shield modifications"
date: 2025-12-31 06:35:12 +0000
layout: post
topics:
  - gamedev
reading_style: essay
description: "Now when I’m collecting the shield powerup I can use it only one time, but I want to make it so that I can use it three times."
medium_url: https://medium.com/@250503_98463/shield-modifications-ec9399e5bff2
---
Now when I’m collecting the shield powerup I can use it only one time, but I want to make it so that I can use it three times.

First as always I’m thinking well how I can do that, best way is to modify current logic, how it works?. When the player clashes with enemy it checks first is the shield was active? if yes then set it value to false and move on, which means after we collected the shield and clashed with enemy I use shield, then when I clash with enemy again if I don’t have a shield, I will lose one of my health.

Now If I add counter of clashing with enemy, I can know how many times I clashed with enemy and according to it after 3 times I can turn it of our shield and in every hit I can change the visual strength of shield too.

For this I created a variables to count and set color of our shield.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*i5xwPc6p4YDD45GkGa8R8A.png)

Here I have a \_shieldRenderer which I will use to which I need to attach the Shields sprite in the Inspector, and I can change the color of the shields with it.

So, now I need to modify the logic of the shield.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*2FxLR-2LDc8AUMMecG7RjQ.png)

Here when I’m colliding with enemy I’m checking if the shield is active if it is I’m incrementing the value of \_shieldUsage and then checking if I hit th enemy once I’m setting color of the shield a bit transparent, if I collided with enemy two times again I’m setting the color of enemy more transparent, if I clashed with enemy three times I’m turning of the shield.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*lCofoejg89qD-SUUzzJD5Q.gif)

And this is the result you can notice that each time when I’m colliding with enemy the shield is getting transparent.

So, this was all for now, thanks for your attention and don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
