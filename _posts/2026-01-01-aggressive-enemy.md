---
title: "Aggressive enemy"
date: 2026-01-01 06:57:07 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "First it looked hard, but after when I searched on internet I found that the Unity has it’s own feature which allows to know the distance…"
medium_url: https://medium.com/@250503_98463/aggressive-enemy-17190ef03ddd
---
First it looked hard, but after when I searched on internet I found that the Unity has it’s own feature which allows to know the distance between two objects.

So then I created the needed variables for aggressive enemy logic, how it works? Well the enemy constantly must check the distance between his position and players position and when its less or equal to some value it must move towards player to collide with it.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*3ESFnHF1Rqgc5-81jPzfug.png)

Here I have a three variables \_detection range for distance to compare, \_isRamming for setting active the colliding or clashing method with player, and finally \_ramSpeed for moving in different speed than usual speed of enemy, because if enemy will move towards Player in constant speed it wouldn’t look like it is being aggressive and intentionally trying to collide with player.

Then I created a logic to calculate the distance between player and enemy

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*s1m9fbFifWwxX6BSTMEkQQ.png)

```csharp
    private void DetectPlayer()
    {
        if(_player  == null)
        {
            return;
        }
         float distance = Vector2.Distance( transform.position, _player.transform.position);

        if(distance <= _detectionRange)
        {
            _isRamming = true;
        }
    }
```

Here first I’m checking is reference of player exists if not then return, if yeas move on to next part where we are calculating the distance between player and enemy with help of Distance then checking is the distance less or equal to range where we want to hit the player if yes then it sets \_isRamming to true, which means we can start moving to player side to collide with it.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*HQzd1EUgxFivGAmjI2vVsQ.png)

```csharp
    private void RamPlayer()
    {
        if(_player == null)
        {
            return;
        }
        Vector2 direction = (_player.transform.position - transform.position).normalized;

        transform.position += (Vector3)(direction * _ramSpeed * Time.deltaTime);

    }
```

Here the logic of moving to player side if \_isRamming is true, yes I’m not using \_isRamming here but I will use it in void Update() where will be main logic of enemy. So here I’m calculating the direction in which our enemy must move it takes the position of player and subtracts the position of enemy, then it calculates the movement.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*JC_sxFv3v5lOahdpZCR83Q.png)

And here is our main logic of enemy first it calculates the distance between its own position and players position then is checks as I meantioned earlier whether \_isRamming is true or not, if it is it cals the Ramming method, if it is not it just calls CalculateMovement which calculates enemies movement if it is time to fire laser then it calls FireLaser method.

So that was all, and as always thanks for your attention
