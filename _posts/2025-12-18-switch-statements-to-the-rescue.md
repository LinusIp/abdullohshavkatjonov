---
title: "Switch Statements to the Rescue"
date: 2025-12-18 07:58:52 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: technical
description: "To use PoweUp logic I used if/else statements, it’s good, but when I have 10 or more statements it will be hard to use, therefore I used…"
medium_url: https://medium.com/@250503_98463/switch-statements-to-the-rescue-c0ef672d71d8
---
To use PoweUp logic I used if/else statements, it’s good, but when I have 10 or more statements it will be hard to use, therefore I used “switch(case)” which is pretty good if you have a multiple conditions.

Here’s the if/else version of PowerUp logic

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

And here’s the switch(case) version of PowerUp logic

```csharp
                switch (powerupID)
                {
                    case 0:
                        player.TripleShotActive();
                        break;
                    case 1:
                        Debug.Log("Speed PowerUp Collected!");
                        break;
                    case 2:
                        Debug.Log("Shield PowerUp Collected!");
                        break;
                    default:
                        Debug.Log("Defaul value");
                        break;
                }
```

We can se that as the umber of statements increases it gets hard to read and write code for each statement.

So then we use switch(case), to make our job easier.

And that was all, thanks for your attention, and as always don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
