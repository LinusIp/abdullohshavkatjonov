---
title: "Simple Player Movement in Unity"
date: 2025-10-26 16:16:01 +0000
layout: post
topics:
  - gamedev
reading_style: technical
medium_url: https://medium.com/@250503_98463/simple-player-movement-in-unity-a768efd7116e
---
“Simple Player movement in Unity — with using this we can get input from user and based on in put we can move our character.”

So first of all we need to create a variable of speed and set to it a value, so our variable will be “\_speed” and it’s value will be 3.5, but why we wrote 3.5f, so as you see the type of our variable is float and therefore we wrote or add “f” at the end of our value.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour

{
    [SerializeField]
    private float _speed = 3.5f;
    // Start is called before the first frame update
    void Start()
    {
        //take the current position = new position (0, 0, 0)
        transform.position = new Vector3(0, 0, 0);
    }

    // Update is called once per frame
    void Update()
    {
        
        
    }
}
```

When we created our variable and gave to it a value, now we can work with

moving of our character, by adding a user input.

To add user input we need to create a variable according to what we want to get from user in our case we want to get in which direction user want to move our character. So we will create a variable with name of “horizontalInput” ant its type will be float, bc the direction can be a floating pint number, after that we need to get this input from user for this we will use “Input.GetAxis” and the value what we’re expecting is Horizontal, why Horizontal not smth. else?, well bc in Unity in InputManager in Axes you can see that it was set as “Horizontal” for Horizontal direction and “Vertical” for vertical direction. This can be explained by imagining our game environment as 2 dimension space where you can move up/down and right/left, like user will press “WASD” keyboards and according to them Unity will know in which direction it will go. To see what is the Name of Horizontal and Vertical Axes are you need to go to Edit → Project Settings → Input Manager → Axes → Horizontal/Vertical. This is essential, bc if you give a wrong Name to “Input.GetAxes()” Unity can’t understand when user presses given button.

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Player : MonoBehaviour

{
    [SerializeField]
    private float _speed = 3.5f;
    // Start is called before the first frame update
    void Start()
    {
        //take the current position = new position (0, 0, 0)
        transform.position = new Vector3(0, 0, 0);
    }

    // Update is called once per frame
    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        transform.Translate(Vector3.left * horizontalInput * _speed * Time.deltaTime); 
        transform.Translate(Vector3.up * verticalInput * _speed * Time.deltaTime);
    }
}
```

In code space above you can se a full code of this user input and action taking based on this input, so what we are doing, we are getting a value from user and multiplying it by “Vector3.up” which is the upward coordinate of our character multiplied by “horizontalInput/verticalInput” which are the inputs from user multiplied by “\_speed” which is a variable whicc contains a value of speed on what we will move multiplied by “Time.deltaTime” which is the time in seconds. So we are getting all values and after making a mathematical calculation getting a new coordinate of our character.

So this was all for today, thanks for reading, hope it will be useful to you guys and pls also dom’t forget to follow me on other social platforms too!)

[https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD](https://youtube.com/@shavkatjonovabdulloh?si=fC4GFIr2mKpEeQYD)

[https://www.instagram.com/abdulloh_shavkatjonov_/](https://www.instagram.com/abdulloh_shavkatjonov_/)

[https://t.me/aicslife](https://t.me/aicslife)
