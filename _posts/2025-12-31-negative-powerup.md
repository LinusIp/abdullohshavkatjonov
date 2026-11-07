---
title: "Negative PowerUp"
date: 2025-12-31 09:21:14 +0000
layout: post
topics:
  - gamedev
reading_style: essay
description: "So I have 4 powerup’s all of them are positive they will give some power, but now time to add a negative powerup which will give a negative…"
medium_url: https://medium.com/@250503_98463/negative-powerup-dcf839045113
---
![Picture from this post](https://cdn-images-1.medium.com/max/800/1*YK8Lz6tBKbhoV2YLqwmBJQ.gif)

So I have 4 powerup’s all of them are positive they will give some power, but now time to add a negative powerup which will give a negative powerup like lucky box in games you not always will get good stuff right?)

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*IQZ-O59aA-QxsTQvmdKvxQ.png)

So first I expanded my l expanded my list of power up’s so that there will be 5 powerup’s and then I started adding a new logic which is slowing the speed of Player when it collects this powerup

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*ggqmkFhHMNynv-x5mW490Q.png)

Here’s the logic of the Negative PowerUp, first when it called(when collided with Player) it sets the `_isNegativePowerUpActive` to true which means we collided with it or we collected it, it will substract 2 from our current speed

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*tqLfCbVLIWN4hlh9iSNURg.png)

And one more thing, I almost forgot I created a new case in this switch statement for new powerup.

You can see it in the Video above as we collected this powerup we started moving slower.

So that was and thanks for you attention
