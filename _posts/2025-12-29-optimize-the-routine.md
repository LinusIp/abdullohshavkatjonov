---
title: "Optimize The Routine"
date: 2025-12-29 06:46:55 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: technical
description: "I was working on the random color changing program and I was using new WaitForSeconds(3.0f) for waiting for 3 seconds and then change the…"
medium_url: https://medium.com/@250503_98463/optimize-the-routine-5e039992e4fb
---
![Picture from this post](https://cdn-images-1.medium.com/max/800/1*0k1j1s1h73QHsiB_QBcJmw.gif)

I was working on the random color changing program and I was using **new WaitForSeconds(3.0f)** for waiting for 3 seconds and then change the color of cube to next random color.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*ukTWWzguAQMiuRFUpFNMJw.png)

But such as I’m using **new** keyword it Instansiates **WaitForSeconds** everytime when I run this, so basically it causes a garbage collection in memory.

To fix this I need to cash this reference, to do this I created a WaitForSeconds type variable to use inside of our ChangeColorRoutine().

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*oacBnXgXZofBoEHLiAn9KA.png)

```csharp
 private WaitForSeconds _changeColorWait = new WaitForSeconds(3.0f);
```

And now I can return it in while loop.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*OUgeifMBxtNL_SRjgqfdWA.png)

By doing so I removed all memory allocation from being used during our while loop every 3 seconds.

And the program works same as before without errors.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*iIANtM8Kl1VQh128krkj3g.gif)

So, as always thanks for your attention, and don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
