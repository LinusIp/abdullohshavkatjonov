---
title: "Enemy Waves"
date: 2026-01-06 11:50:06 +0000
layout: post
topics:
  - gamedev
reading_style: technical
description: "Now I added an enemy wave in my game. First I created variables what I need, _firstWave for first wave, _incrementWaveBy to calculate…"
medium_url: https://medium.com/@250503_98463/enemy-waves-618c5236448d
---
Now I added an enemy wave in my game. First I created variables what I need, `_firstWave` for first wave, `_incrementWaveBy` to calculate enemies in the next waves, and `_currentWave` to know which leve is now to calculate the numbers of enemies for current wave.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*3m4O_0mzppc5KTWb2KTTWg.png)

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*Qw5spV2io9oIHKQUL8AuwA.png)

```csharp
    IEnumerator SpawnEnemyRoutine()
    {
        yield return new WaitForSeconds(3.0f);

        while (_stopSpawning == false)
        {   
            int _enemiesInThisWave = _firstWave + _incrementWaveBy * (_currentWave - 1);
            
            for(int i = 0; i < _enemiesInThisWave; i++)
            {
                yield return new WaitForSeconds(1.0f);
                EnemySpawn();
            }
            yield return new WaitUntil(() =>
            _stopSpawning || _enemyContainer != null && _enemyContainer.transform.childCount == 0);

            yield return new WaitForSeconds(3.0f);

            _currentWave++;
        }
    }
```

Here first I’m waiting for 3 seconds then starting while loop to run waves, and inside of new variable `_enemiesInThisWave` I’m calculating how many enemies will be in this wave, after that not to spawn given number of enemies in current wave I’m using for loop to spawn enemies with calling EnemySpawn method N times which is equal to number of enemies in this wave and waiting 1 second before spawning the enemy to avoid spawning them all in one time.

Then Updated my current SpawnEnemyRoutine() and created a new method to spawn enemies.

![Picture from this post](https://cdn-images-1.medium.com/max/800/1*IvWG5sDWpDXdjWUi-UuQ1w.png)

After spawning all enemies I’m checking is the enemy container is empty.

So that’s is all for now and as always thanks for your attention
