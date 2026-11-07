---
title: "Ease of Building UI Elements in Unity"
date: 2025-12-19 07:09:04 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "We use UI elements in Unity to make game better and understandable."
medium_url: https://medium.com/@250503_98463/ease-of-building-ui-elements-in-unity-17c6597e95a9
---
We use UI elements in Unity to make game better and understandable.

Build the UI elements in Unity is pretty easy, it’s like a working with text editor or some editing tools nothing complex.

So first I created Canvass to control all UI elements to make so I right clicked to Hierarchy and choose UI → Text-TextMeshPro.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*epcAfePrBpPO1pS2Zo2a0w.gif)

Then you can edit the text as you want change the color, size, and more.

And we also can work with it with code for this we need to comunicate with UIManager.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
```

In addition to default libraries I use “UnityEngine.UI” and “TMPro” to be able to work with UI in unity.

Then I created a variable called **\_scoreText** to work with text in code.

```csharp
[SerializeField]
private TMP_Text _scoreText;
```

Why \[SerializeField\], because we will be able to work with it in the Inspector too.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*Wn6UHRJhH1ZjNtfgKOciAA.gif)

As you can see now I have a object in Canvas which is our text.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*W1FWnlGEmW1Bud4_-OVzEA.png)

And now we can work with text from code, which is pretty cool, like we can edit text in real time after some or according to some action in game.

So, now as always, don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
