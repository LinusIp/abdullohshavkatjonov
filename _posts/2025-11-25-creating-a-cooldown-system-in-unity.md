---
title: "Creating A Cooldown System in Unity"
date: 2025-11-25 15:35:56 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: technical
description: "So why we need to cooldown in Unity, basically it is like a taking a little break before repeating the action. Lets say we have a shooting…"
medium_url: https://medium.com/@250503_98463/creating-a-cooldown-system-in-unity-b9b591c3a3bd
---
So why we need to cooldown in Unity, basically it is like a taking a little break before repeating the action. Lets say we have a shooting function and we need to shoot , but in usual case we fire infinitely without stopping, in order to stop for few milliseconds and thenn shoot we need to use a cooldown.

```csharp
[SerializeField]
    private float _firRate = 0.15f;
    private float _canFire = -1f;
```

For example in this case we want to stop for 0.15 seconds and then shoot again.

```csharp
 void Update()
    {

       if(Input.GetKeyDown(KeyCode.Space) && Time.time > _canFire)
       {
            _canFire = Time.time + _firRate;
            Instantiate(_laserPrefab, new Vector3(transform.position.x,transform.position.y+0.8f, transform.position.z ), Quaternion.identity  );
       }

    }
```

Like we told here we are using cooldown to have a short small time between each shot, so we use a cooldown logic, first we are checking if the current time is greater than our needed time here we use **\_canFire** variable which is the variable to store a time after each iteration. First the **\_canFire** is equal to -1 and lets say our current time is equal to 1 which means our if statement is true and then we update **\_canFire** now it is equal to “1 current time + 0.15 our fire rate” which is equal to 1.15 which means now the if statement is not true until our current time will be grater than updated **\_canFire** and then we will update our \_canfire like this it will iterate till the end of our game. Like this we got a cool cooldown effect.

As always thanks for your attention and also do not forget to subscribe to me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
