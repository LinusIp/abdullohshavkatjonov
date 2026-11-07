---
title: "Damage VFX using Animated Sprites in Unity"
date: 2025-12-22 17:24:52 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "I added VFX using Animated Sprites and It made game more cooler and beautiful."
medium_url: https://medium.com/@250503_98463/damage-vfx-using-animated-sprites-in-unity-b4991ffcc19c
---
I added VFX using Animated Sprites and It made game more cooler and beautiful.

First I added a logic for this effects when they will appear.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*zq-NU-eJmtnr1aCHZ08hIQ.png)

This two are the engine fires so with creating the variables I can work with this effects in code.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*HPnajm7BV-Q7klEKU5DI7g.png)

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*HPnajm7BV-Q7klEKU5DI7g.png)

And now time for the logic of this two effects, so that they can animate at right time and here’s the logic.

```csharp
if(_lives == 2)
{
    _rightEngine.SetActive(true);
}
else if( _lives == 1)
{
    _leftEngine.SetActive(true);
}
```

If our life is equal to 2 we set fire on right engine, if our life is equal to 1 we set fire on both engines.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*v55DnRqHM-WolSl8c3eyxw.gif)

So this is how it will animate, and now we can test it out in game.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*u8jfyRfZs2k6X-O_3QcAzQ.gif)

So now our game is looking Incredible with VFX effects.

That was all, and as always thanks for your attention and don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
