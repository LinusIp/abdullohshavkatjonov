---
title: "Instantiating & Destroying Gameobjects in Unity"
date: 2025-11-24 17:48:18 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: technical
description: "Instantiating"
medium_url: https://medium.com/@250503_98463/instantiating-destroying-gameobjects-in-unity-b12dd08c8b84
---
## Instantiating

To instantiate an object we need to choose which object we will instantiate in our case it is a laser and create a variable GameObject and we can call it “\_laserPrefab”.

```csharp
void Update()
{
    Instantiate(NameOfObject, transform.position, Quaternion.identity);
}
```

So in first argument we will write the name of object what we want to Instantiate and in second argument we need to write the in which position we want it to be **transform.position** means it spawns in position where our object stands and finally in third argument we need to write how we want it to rotate in our case it is ( 0, 0, 0) which means no rotation.

## Destroing GameObject

To destroy game object all of what we need to do is simply telling which object we want to destroy.

```csharp
void Update() 
{
    Destroy(this.gameObject);
}
```

To destroy GameObjects in Unity we use command “**Destroy(gameObject);”**

We are using “**this**” in **“Destroy”** because we are destoing the object which attached to this Script in what we’re working on.

Thanks for your attention, and also don’t forgot to follow mw on other social media platforms to get fresh news about Game developing journey.

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
