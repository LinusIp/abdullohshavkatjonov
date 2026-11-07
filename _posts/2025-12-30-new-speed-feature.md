---
title: "New Speed feature."
date: 2025-12-30 04:29:11 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "I wanted to move the player at an increased rate when the ‘Left Shift’ key is pressed down. Reset back to normal speed when the ‘Left…"
medium_url: https://medium.com/@250503_98463/new-speed-feature-409263618e88
---
I wanted to move the player at an increased rate when the ‘Left Shift’ key is pressed down. Reset back to normal speed when the ‘Left Shift’ key is released. So how I can do it first I set a logic in Players CalculateMovement() method.

```csharp
        if (Input.GetKeyDown(KeyCode.LeftShift))
        {
            _speed = _speed * 2;
        }
        else if (Input.GetKeyUp(KeyCode.LeftShift))
        {
            _speed = _speed / 2;
        }
```

So what this logic does, basically when we press LeftShift key it multiplies our speed by 2, and when we release the LeftShift key it devides \_speed variable by 2, which means it resets \_speed back to normal and like this I got a new feature.

And to check whether the LeftShift key is pressed or released I used Debug.Log() to print out it in console.

And this is how it is working, I guess it is pretty good. So, as always thanks for your attention, and don’t forget to subscribe to my other channels in other social platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
