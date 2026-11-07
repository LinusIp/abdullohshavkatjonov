---
title: "Making game better with visual effects."
date: 2025-12-30 07:41:28 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "So, in the previously when I added speed boost when I press LeftShift key, in order to know whether the speed is boosted or not I used to…"
medium_url: https://medium.com/@250503_98463/making-game-better-with-visual-effects-bd2d67d51c1b
---
So, in the previously when I added speed boost when I press LeftShift key, in order to know whether the speed is boosted or not I used to print a text message in console, but it is not good looking so now I made it so instead of printing text, it will change the color of thruster, so that it will look like i really boosted.

First I created a needed variables to work with.

```csharp
public Color normal_color = Color.white;
public Color boost_color = new Color(233f / 255f, 142f / 255f, 25f / 255f);
[SerializeField]
private SpriteRenderer _thrustRenderer;
```

there two colors first is default normal color the second one is boosting color which is near to orange.

Then I created variable to be able to work with thrust sprite of Player which is type of SpriteRenderer.

So then I turned our speed boost logic inside of CalculateMovement() method in to another method which is SpeedBooster() method.

And inside of this SpeedBooster() I added a color changing logic.

So here I’m checking if the LeftShift key is pressed I’m multiplying the speed by 2 and changing color, if I released the key then I’m dividing current speed by 2 and setting the color back to white.

And here is the final result!) So as always thanks for your attention and don’t forget to follow me in other social media platforms!)

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
