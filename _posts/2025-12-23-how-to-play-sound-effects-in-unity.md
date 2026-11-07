---
title: "How to Play Sound Effects in Unity"
date: 2025-12-23 17:34:47 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "Now I need to add the sound for PowerUp’s, to make this I use PlayClipAtPoint, why? because it helps to play sound at given point in my…"
medium_url: https://medium.com/@250503_98463/how-to-play-sound-effects-in-unity-c5f56e530ade
---
Now I need to add the sound for PowerUp’s, to make this I use PlayClipAtPoint, why? because it helps to play sound at given point in my case it is when the Player collects a PowerUp.

For this I created a variable \_clip and with \[SerializeField\] make it so I can work with in the Inspector.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*pwPwCvhbYmAyABGuEMS09w.png)

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*PJUTq6ND9cdhtAajfFHbcg.png)

And I attached to it our power\_up\_sound, by selecting all three powerup prefabs.

And now I can write a logic so that it will work at needed place.

```csharp
private void OnTriggerEnter2D(Collider2D other)
{
    if(other.tag == "Player")
    {
        AudioSource.PlayClipAtPoint(_clip, transform.position);

        Player player = other.transform.GetComponent<Player>();
        if (player != null)
        {
            
            switch (powerupID)
            {
                case 0:
                    player.TripleShotActive();
                    break;
                case 1:
                    player.SpeedBoostActive();
                    break;
                case 2:
                    player.ShieldActive();                   
                    break;
                default:
                    Debug.Log("Defaul value");
                    break;
            }
        }
        Destroy(this.gameObject );
    }
}
```

Here is the logic for our powerup’s colliding with the player and when it collides we tell play the audio

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*gI5u_nVUgLAT1MEpDsKs9w.png)

By this I’m telling that play this \_clip to which assigned our power\_up\_sound at the position of our Player, basically when it reaches the position of our Player.

And that’s all, thanks for your attention, and as always don’t forget to follow me in other social media platforms too

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
