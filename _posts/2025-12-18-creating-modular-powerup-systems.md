---
title: "Creating Modular Powerup Systems"
date: 2025-12-18 06:24:00 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "I got few PowerUp’s like Speed powerup, Tripleshot powerup, and Speed powerup.\nTo be able to use all this powerup’s I need ed to know with…"
medium_url: https://medium.com/@250503_98463/creating-modular-powerup-systems-65b7087699f9
---
I got few PowerUp’s like Speed powerup, Tripleshot powerup, and Speed powerup. To be able to use all this powerup’s I need ed to know with which one I’m colliding with, so I created a variable named “powerupID”.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*qmU-suVPNaZnVUV7-Uo-4Q.png)

Which helps to know which powerup I’m colliding with, and “\[SerializeField\]” helps to edit or set ID’s to powerups in inspector window.

```csharp
if(powerupID == 0)
{
    player.TripleShotActive();
}
else if(powerupID == 1)
{
    Debug.Log("Speed PowerUp Collected!");
}
else if(powerupID == 2)
{
    Debug.Log("Shield PowerUp Collected!");
}
```

And according to ID’s I will know which powerup it is and what it should do.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*Ige78bnA7wbXkdQP8W8Q5w.gif)

As you see when we collect speed powerup niw console print “Speed PowerUp Collected!” and when we collect TripleShot PowerUp we are getting triple shot. So now is the time to write a full logic for all powerup’s. Thanks for your attention and don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
