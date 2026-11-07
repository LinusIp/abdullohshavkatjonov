---
title: "Creating a Retro Game Over Behavior"
date: 2025-12-20 14:46:14 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "When we die in the game we always see the annoying GAME OVER text 😅"
medium_url: https://medium.com/@250503_98463/creating-a-retro-game-over-behavior-133eca49122b
---
When we die in the game we always see the annoying **GAME OVER** text 😅

So how actually it works and how we also can do it?

The answer is simple, first I created a new text inside Canvas and created a new variavle in code with \[SerializeField\] to be able to work with it in inspector.

So after creating a new variable **\_gameOverText** I need to attach it to Canvas .

After that I made it so it will be diactivated at the beginning the game inside of void Start()

then I need a logic how it will flicker, so for this I created a coroutine

and inside of this coroutine I write a infinite loop to flicker the text,

first it will print **GAME OVER** the it will wait 0.5 seconds and after that it will print nothing and again will wait 0.5 seconds, so like this it will give a illusion of flickering.

So this is how we get a **GAME OVER** flicker animation at the end of the game when player dies.

And as always thanks for your attention, and don’t forget to subscribe to me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
