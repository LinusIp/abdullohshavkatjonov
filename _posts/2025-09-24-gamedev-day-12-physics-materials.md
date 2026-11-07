---
title: "GameDev Day:12 “Physics Materials”"
date: 2025-09-24 18:19:15 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: essay
description: "Today we are going to learn how to make a physics materials."
medium_url: https://medium.com/@250503_98463/gamedev-day-12-physics-materials-00d1807043dd
---
Today we are going to learn how to make a physics materials.

So first of all we need to prepare our environment.

First thing what we need to do is creating a plane. After creating a plane set it’s size as **x** = 10, **y** = 10, and also position (x, y, z) = (0, 0, 0) but you can change the position based on your environment, in our case it is just starting position after reshaping it you need to re-place it according to your environment.

After that we will need to create a wall, for this first we need to create a cube and then set it’s size as (x, y, z) = (4, 5, 9) or any value so that it will be able to stop our ball. And then re-center it to (x, y, z) = (0, 0, 0) but you can change the position based on your environment, in our case it is just starting position after reshaping it you need to re-place it according to your environment.

The next step will be building a ramp for this we also will use cube and change it’s size and position and angle so it will look like a ramp.

**Position**: (x, y, z) = (0, 0, 0) but you can change the position based on your environment, in our case it is just starting position after reshaping it you need to re-place it according to your environment, **Angle**: z = -45, **Size**: (x, y, z) = (9, 0.5, 4)

The last object what we will need is a ball itself or sphere. First we need to create a sphere and then re-shape it and re-position it based on your environment.

So finally we can work with physics, first we need to add a physics itself to our ball, to do so we need to select our ball and got to **Inspector** window and go down till **Add Component**, click on it and search for Rigidbody and select after selecting it will add a physics to your object.

And after adding a physics we need to add Physics Material, so first we need to go to project window and right click to ***Assets*** and choose create a folder and rename it as ***Physics Materials*** and now you need to right click to ***Physics Materials*** folder and again choose create, but this time not a folder but **Physics Material** and give a name to it such as let’s say “**Bounce**”.

And now we finally arrived to the part where we will add a bounce to our ball, but before it we need to edit our Bounce so if you select Bounce in right side in **Inspector** window you will see the settings of our Bounce here you need to change all values to 0 except Bounce itself it must be 1, bc 1 means a **100**% of Bouncing(there in settings the values can be only between 0 and 1, 0 means 0%, and 1 means 100%) , so now to add a Bounce to our ball we need to select an object in our case it is a our ball or sphere, and when you select it you will see **Inspector** window on the right side and there you need to go to **Sphere Collider** and here you can see materials setting which is currently NONE, so you need to select our Bounce and grab it and out it into materials which is located in Inspector → Sphere Collider.

And so like this you got a bouncing ball.

And now as always thanks for your attention guys and don’t forgot to subscribe to me on other social platforms!)

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
