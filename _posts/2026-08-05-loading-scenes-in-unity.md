---
title: Loading Scenes in Unity
date: 2026-08-05
layout: post
---
Loading Scenes in the Unity is pretty useful, and important because when I tried to make a Menu I needed a new scene, such as in the scene where my game is playing is already using for game.

So I created a new scene where will be my menu and modified as I want it to look, and now the main problem how I’m going to connect a Menu with Game?

No, worries in reality i was way more easier than I thought at the beginning.

Press enter or click to view image in full size

First I created a new scene — after that I saved it in Scenes folder and opened a Building Settings from here I can sae a scenes what I have and then I press **add open scene** button and it adds it to scenes with number attached to it which is its we can say order or ID with what we will work when we are loading scenes.

After that I created a new script for a new scene which is a **MainMenu.cs** to load other scenes.  
Now I write a new public function **LoadGame()** to load other scenes, and here with using a **SceneManger** I’m loading the needed scene with **LoadScene().**



![](assets/img.webp)



&nbsp;

Here the 1 is an order number or we can say ID of the scene what we need to load,and it also can be a Name of the scene, in both cases it works.

![](assets/img2.webp)

And in order to be able to use a **SceneManager** I included a new library.

```
using UnityEngine.SceneManager;
```

![](assets/img3.webp)

And then I created a new button and then I added a new **OnClick()** action in inspector and from there I attach the **Canvas** to the **OnClick()** and once I attached I can choose the function it will call from here I go to **MainMenu** script and call **LoadGame()** function, why I attached the **Canvas**, well because the Main menu script is the component of the **Canvas** and I can use its functions and call them on some action, like clicking on button as in our case.

Press enter or click to view image in full size

  
So this is all as you can is even if it seems hard at the beginning it may be super easy.

*And a*s always thanks for your attention, and don’t forget to follow me in other socail media platofrms!)