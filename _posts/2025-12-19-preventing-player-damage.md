---
title: "Preventing Player Damage"
date: 2025-12-19 10:43:27 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "To protect Player from damage we need to give a shield.\nSo I added a new PowerUp which is a Shield_PowerUp"
medium_url: https://medium.com/@250503_98463/preventing-player-damage-1c655ee70860
---
To protect Player from damage we need to give a shield. So I added a new PowerUp which is a Shield\_PowerUp

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*lZDz9n6mDe6hHAyHMYhN4g.png)

So now we need a logic for it, first of all our player has 3 lives and power up will not add another live, but will protect it once.

```cpp
    public void Damage()
    {
        _lives--;

        if(_lives < 1)
        {
            _spawnManager.OnPlayerDeath();
            Destroy(this.gameObject);
        }
```

This is the logic of damaging player and we need to create a logic for shield.

```csharp
    public void Damage()
    {
        if(_isShieldActive == true)
        {
            _isShieldActive = false;
            return;
        }

        _lives--;

        if(_lives < 1)
        {
            _spawnManager.OnPlayerDeath();
            Destroy(this.gameObject);
        }
```

Here I added shield logic, first it checks wheter our player got shield or not, then it will set the value of **\_isShieldActive** to false, because we can use one shield only one time, and after that it returns basically says stop. so why it works it works because the demage method will be called each time when we crash with enemy so in the first time when we crash with enemy it does nothing just says “now we don’t have a shield” and the next time when we hit enemy it says do we have a shield, which we don’t and takes one of our lives.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*DrLD_vqtmGKZpVIppx0ACA.gif)

Here you can see that at the beginning we have a 3 lives and after we collect Shield PowerUp and when we hit the enemy our lives reamains, but when we hit enemy second time when our shield already deactivated, we lose one life. Which means that everything is working good.

So like this I add a Shield PowerUp to my game.

And as always thanks for your attention and don’t forget to subscribe to me in other social media accounts

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
