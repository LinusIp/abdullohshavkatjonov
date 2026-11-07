---
title: "Limited Ammo"
date: 2026-01-02 03:14:06 +0000
layout: post
topics:
  - gamedev
  - coding
reading_style: technical
description: "I wanted to add a limit to Player firing lasers and I set it to 15."
medium_url: https://medium.com/@250503_98463/limited-ammo-29a1d0cae59e
---
I wanted to add a limit to Player firing lasers and I set it to 15.

First I created a text which will appear when Player will reach the limit.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*Qky57wWtG4za0yKIcelN8w.png)

This is the variable for text,

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*GCjHYfivItAhP3jkQLUa1w.png)

And this is the variable for laser firing limit.

Then I build a logic for this limit inside of Player script

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*y38Jio3kuyXzD2aYncKUuw.png)

```csharp
if (_ammoAmount > 1)
{
    Vector3 distance = transform.position + new Vector3(0, 0.8f, 0);
    _canFire = Time.time + _fireRate;

    if (_isTripleShotActive == true)
    {
        Instantiate(_tripleShotPrefab, transform.position, Quaternion.identity);
    }
    else
    {

        Instantiate(_laserPrefab, distance, Quaternion.identity);

    }
    _audioSource.Play();
    _ammoAmount--;
}
else
{
    _uiManager.AmmoFlicker();
}
```

Now what it does? First it checks is the current ammo counnt is greater than our limit if yes then it fires if no it shows text “Ammo Is Empty”. And here I call a method from UIManager which calls a Flicker text method in UIManager.

```csharp
    public void AmmoFlicker()
    {
        StartCoroutine(AmmoIsEmptyRoutine());
    }
```

```csharp
    IEnumerator AmmoIsEmptyRoutine()
    {
        while (true)
        {
            _ammoIsEmptyText.text = "AMMO IS EMPTY";
            yield return new WaitForSeconds(0.5f);
            _ammoIsEmptyText.text = " ";
            yield return new WaitForSeconds(0.5f);
        }
    }
```

So that’s it, but here comes one question but what we will do after we run out of ammo?

The answer is simple we need to add a power up for this or we can use existing power up’s like TripleShot PowerUp.

Which is quite easy to do all we need to do is resetting the value of `_ammoAmount` when we collect TripleShot Power up.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*yUKEG5NH4fUc-zqex2v5tw.png)

Here when we run out of ammo if we will reset the value of `_ammoAmount` back to 15 when we collect A TripleShot powerup we can fire again, problem solved, yes there also other approaches to solve this problem, but this is the fastest way to solve this problem

And as always thanks for your attention, and don’t forget to follow me in other social media platforms

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
