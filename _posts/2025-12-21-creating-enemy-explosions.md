---
title: "Creating Enemy Explosions"
date: 2025-12-21 15:15:31 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "I created the Enemy explosion, but I got sum bugs which I solved, but still there some work need to be done."
medium_url: https://medium.com/@250503_98463/creating-enemy-explosions-81e1ccb4f348
---
I created the Enemy explosion, but I got sum bugs which I solved, but still there some work need to be done.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*AoyifUiHSsffoKvT5uBBgw.gif)

So basically this is the result, not best one, but better First of all I created the animation for Enemy, by creating a new animation for Enemy.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*nZnvqLelcguir5-nJi2zVw.gif)

After I got the right animation I opened Animator window by clicking the Enemy animator in the Project window.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*mviR9htOaCv-kKfQrbrL9w.gif)

And then I created an empty animation to make sure that the enemies won’t explode right after spawning and then I made a transition to the explosion animation of enemy, afther which I created a Trigger parametr OnEnemyDeath which will help to work with this animation.

So then I created a variable \_anim to work with animation inside of Enemy.cs script

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*BEfBP6lpo26oQAvNGqIuNg.png)

and then to avoid calling Animator each time I called it at the beginning of our script in th **void Start()** function

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*Ukd3ax8IIIvMJILwhss6wA.png)

which will help me to save resources in memory.

After that I can use this Animation when we collide with Player and with Laser.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*r7SInX6LojDssh4Ol4cu5A.png)

Here I use this Animation when our Enemy will hit the player

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*LyYWRten8geD0BG9AxRIJQ.png)

and here when our Enemy will hit the Laser and why we are setting speed = 0, well it’s because we want the enemy stop and then explode.

And here left one more thing to do which is exploiding enemies right after they collide with the Player or with Laser, without any delays.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*hG3jBx5CzfaNYNX8d8ms5w.gif)

So like this we need to turn off Has Exit Time and set the value of Transition Duration to 0.

That was all, and as always thanks for your attention and don’t forget to subscribe to me inn ither social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
